import { Injectable } from '@nestjs/common';
import { getPaymentModel, paymentDocument, getTenantModel } from 'sidalibs';
import { getDateRange } from './admin.helpers';
import { GetRevenueArgs, revenueResponse, tenantResponse, tenantType, tenantWithPaymnets } from './admin.type';


@Injectable()
export class AdminService {


    async getRevenue(args: GetRevenueArgs): Promise<revenueResponse> {
        const now = new Date();
        let { startDate, endDate } = getDateRange(args)

        let paymentModel = getPaymentModel()
        const result: paymentDocument[] = await paymentModel.findOld({
            paidAt: { $gte: startDate, $lt: endDate },
            status: 'completed',
        })

        let counteries = []
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            if (!counteries.includes(element.countery)) {
                counteries.push(element.countery)
            }
        }

        let resultWithCounteries = {}

        for(let i = 0; i < counteries.length; i++) {
            const element = counteries[i];
            resultWithCounteries.element = result.

            
        }


        return {
            startDate,
            endDate,
            count: result.length || 0,
            totalRevenue: result.reduce((acc: number, payment: any) => acc + payment.amount, 0) || 0,
            payments: result || [],
        };
    }


    async getTenants(): Promise<tenantResponse> {
        let tenantModel = getTenantModel()
        const data: any[] = await tenantModel.findOld({})
        let result: tenantWithPaymnets[] = []

        for (let i = 0; i < data.length; i++) {

            const tenant = {...data[i]};
            
            
            
            const payment = await getPaymentModel().findOld({ tenantId: tenant._doc._id })
                
            tenant._doc.payments = payment;
            result.push(tenant._doc)
        }
         
        console.log("-------------------------------------------",result )
        
        return {
            message: 'success',
            all : result,
            active: result.filter((tenant: tenantWithPaymnets) => { if (tenant?.status && tenant.status === 'active') { return tenant } }),
            activeCount: result.filter((tenant: tenantWithPaymnets) => { if (tenant?.status && tenant.status === 'active') { return tenant } }).length,
            inactive: result.filter((tenant: tenantWithPaymnets) => { if (!tenant?.status || tenant.status !== 'active') { return tenant } }),
            inactiveCount: result.filter((tenant: tenantWithPaymnets) => { if (!tenant?.status || tenant.status !== 'active') { return tenant } }).length
        };
    }

    // async getTotalBranchesCount(): Promise<number> {
    //     const result = await getTenantModel().aggregate([
    //         {
    //             $group: {
    //                 _id: null,
    //                 totalBranches: { $sum: '$branchesCount' },
    //             },
    //         },
    //     ]);

    //     return result[0]?.totalBranches || 0;
    // }

}
