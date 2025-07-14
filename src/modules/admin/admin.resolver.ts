import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { GetRevenueArgs, revenueResponse, tenantResponse } from './admin.type';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => revenueResponse)
  async revenue(@Args('args') args: GetRevenueArgs): Promise<revenueResponse> {
    const result = await this.adminService.getRevenue(args);
    return result;
  }


  @Query(()=> tenantResponse)
  async tenants(): Promise<tenantResponse> {
    const result = await this.adminService.getTenants();
    return result;
  }

  // @Query(()=> Int)
  // async totalBranchesCount(): Promise<number> {
  //   const result = await this.adminService.getTotalBranchesCount();
  //   return result;
  // }


}
