import {MigrationInterface, QueryRunner} from "typeorm";

export class addsProposalEntity1614538070906 implements MigrationInterface {
    name = 'addsProposalEntity1614538070906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "proposals" ("id" SERIAL NOT NULL, "offerAddress" character varying NOT NULL, "wantedAddress" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_db524c8db8e126a38a2f16d8cac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "proposals" ADD CONSTRAINT "FK_a203223b94df0abb854c0ca404a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proposals" DROP CONSTRAINT "FK_a203223b94df0abb854c0ca404a"`);
        await queryRunner.query(`DROP TABLE "proposals"`);
    }

}
