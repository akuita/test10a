import {
  Brackets,
  Repository,
  DeepPartial,
  ObjectLiteral,
  SelectQueryBuilder,
  WhereExpressionBuilder,
  QueryRunner,
  UpdateResult,
} from 'typeorm'
import { NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '@constants/index'
import { AttendanceRecord } from 'src/entities/attendance_records.ts'
import { UiComponent } from 'src/entities/ui_components.ts'

type ClassType<T> = {
  new (...args: unknown[]): T
}

export enum QueryOperators {
  START_WITH = 'START_WITH',
  END_WITH = 'END_WITH',
  CONTAINS = 'CONTAINS',
  CONTAIN = 'CONTAIN',
  LIKE = 'LIKE',
  NOT_EQUAL = 'NOT_EQUAL',
  EQUAL = 'EQUAL',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  GREATER_OR_EQUAL_THAN = 'GREATER_OR_EQUAL_THAN',
  LESS_OR_EQUAL_THAN = 'LESS_OR_EQUAL_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  BETWEEN = 'BETWEEN',
}

export enum QueryWhereType {
  WHERE = 'WHERE',
  WHERE_AND = 'WHERE_AND',
  WHERE_OR = 'WHERE_OR',
}

export enum QueryOrderDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type CondtionItem = {
  whereType: QueryWhereType
  column?: string
  value?: unknown
  operator?: QueryOperators
  paramName?: string // use for relation condition
  conditions?: QueryCondition[]
  builder?: ConditionFunction
}
export type ConditionFunction = (value: WhereExpressionBuilder) => WhereExpressionBuilder
export type QueryCondition = CondtionItem | ConditionFunction

export type QueryPagination = {
  page: number
  limit: number
}

export type QueryOrder = {
  orderBy: string
  orderDir: QueryOrderDir
}

export type QueryRelation = {
  column: string
  alias: string
  order?: QueryOrder
  joinType?: 'left' | 'inner' | 'count'
  joinCondition?: CondtionItem
}

export class BaseRepository<T> extends Repository<T> {
  protected get alias(): string {
    return this.metadata.tableName
  }

  protected get primaryFields(): string[] {
    return this.metadata.primaryColumns.map((column) => column.propertyName)
  }

  protected get entityType(): ClassType<T> {
    return this.target as ClassType<T>
  }

  // ... (rest of the existing methods)

  public async disableCheckInButton(employeeId: number): Promise<UpdateResult> {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // Check if there's a 'checked_in' record for today
    const attendanceRecord = await this.manager.findOne(AttendanceRecord, {
      where: {
        employee_id: employeeId,
        date: currentDate,
        status: 'checked_in',
      },
    });

    if (attendanceRecord) {
      // Disable 'Check in' button
      const updateResult = await this.manager.update(UiComponent, {
        component_name: 'Check in',
        employee_id: employeeId,
      }, {
        status: 'disabled',
      });

      // Ensure 'Checked out' button remains inactive
      await this.manager.update(UiComponent, {
        component_name: 'Checked out',
        employee_id: employeeId,
      }, {
        status: 'inactive',
      });

      return updateResult;
    }

    throw new NotFoundException(`No 'checked_in' record found for employee ID ${employeeId} on date ${currentDate}`);
  }

  private _toBindingVariable(name: string) {
    return `:${name}`
  }

  private _toBindingArray(name: string) {
    return `:...${name}`
  }
}