import { InputType, Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsDate, IsNumber } from 'class-validator';
import { PlanDuration, PlanType } from 'sidalibs';


// --------------------------- paymentTypes --------------------------

@ObjectType()
export class PaymentType {
  @Field()
  tenantId!: string;

  @Field()
  amount!: number;

  @Field()
  type!: 'subscription' | 'purchase' | 'other';

  @Field()
  status!: 'completed' | 'failed' | 'pending';

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: false })
  paidAt!: Date;

  @Field({ nullable: false })
  countery!:string;

  @Field({ nullable: false })
  plan!:string;

}

enum RevenueType {
  monthly = 'monthly',
  yearly = 'yearly'
}

export enum RevenueTypeEnum {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

registerEnumType(RevenueTypeEnum, {
  name: 'RevenueTypeEnum',
});

@InputType()
export class GetRevenueArgs {
  @Field(type => RevenueTypeEnum, { nullable: true })
  @IsEnum(RevenueTypeEnum)
  type?: RevenueTypeEnum;

  @Field(type => Int, { nullable: true })
  @IsNumber()
  month?: number;

  @Field(type => Int, { nullable: true })
  @IsNumber()
  year?: number;

  @Field({ nullable: true })
  start?: string;

  @Field({ nullable: true })
  @IsDate()
  end?: string;
}

@ObjectType()
export class revenueResponse {
  @Field(type => Date, { nullable: false, })
  startDate!: Date;
  @Field(type => Date, { nullable: false, })
  endDate!: Date;
  @Field(type => Int, { nullable: false, })
  count!: number;
  @Field(type => Int, { nullable: false, })
  totalRevenue!: number;
  @Field(type => [PaymentType], { nullable: false, })
  payments!: PaymentType[];
}


// --------------------------------- tenantTypes --------------------------

@ObjectType()
export class RequestedPlan {
  @Field(type => PlanType)
  plan!: PlanType;

  @Field(type => PlanDuration)
  duration!: PlanDuration;
}

@ObjectType()
export class tenantType {
  @Field(type => String)
  ownerFirstName!: string;

  @Field(type => String)
  ownerLastName!: string;

  @Field(type => String)
  companyName!: string;

  @Field(type => String)
  businessNumber!: string;

  @Field(type => String)
  Email!: string;

  @Field(type => String)
  countryCode!: string;

  @Field(type => String)
  phoneNumber!: string;

  @Field(type => Boolean)
  confirmed!: boolean;

  @Field(type => Boolean)
  seconderyNameing!: boolean;

  @Field(type => Boolean)
  pricesWithVat!: boolean;

  @Field(type => Boolean)
  specficSupplier!: boolean;

  @Field(type => String)
  timeZone!: string;

  @Field(type => String || null ,{nullable: true})
  status?: string | null;

  @Field(type => RequestedPlan, { nullable: true })
  requestedPlan?: RequestedPlan;

  @Field(type => Int, { nullable: true })
  branchesCount?: number;
}


@ObjectType()
export class tenantResponse {
  @Field(type => String)
  message!: string;

  @Field(type => [tenantWithPaymnets])
  all!: tenantWithPaymnets[];

  @Field(type => [tenantWithPaymnets])
  active!: tenantWithPaymnets[];

  @Field(type => [tenantWithPaymnets])
  inactive!: tenantWithPaymnets[];

  @Field(type => Int)
  activeCount!: number;

  @Field(type => Int)
  inactiveCount!: number;
}

@ObjectType()
export class tenantWithPaymnets extends tenantType {
  
  @Field(type => [PaymentType])
  payments!: PaymentType[];
}





