import {MigrationInterface, QueryRunner} from "typeorm";

export class addUsersTable1613337037175 implements MigrationInterface {
    name = 'addUsersTable1613337037175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "pubAddr" character varying NOT NULL, "nonce" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
