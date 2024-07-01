import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class updateEmployeesTableWithRelations1719856137849 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'employees',
            new TableForeignKey({
                columnNames: ['id'],
                referencedColumnNames: ['employee_id'],
                referencedTableName: 'attendance_records',
                onDelete: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('employees');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('id') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('employees', foreignKey);
        }
    }
}