import {MigrationInterface, QueryRunner} from "typeorm";

export class nullableProposalAddresses1614545321113 implements MigrationInterface {
    name = 'nullableProposalAddresses1614545321113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proposals" ALTER COLUMN "offerAddress" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "proposals"."offerAddress" IS NULL`);
        await queryRunner.query(`ALTER TABLE "proposals" ALTER COLUMN "offerAddress" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "proposals" ALTER COLUMN "wantedAddress" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "proposals"."wantedAddress" IS NULL`);
        await queryRunner.query(`ALTER TABLE "proposals" ALTER COLUMN "wantedAddress" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "proposals" ALTER COLUMN "wantedAddress" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "proposals"."wantedAddress" IS NULL`);
        await queryRunner.query(`ALTER TABLE "proposals" ALTER COLUMN "wantedAddress" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "proposals" ALTER COLUMN "offerAddress" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "proposals"."offerAddress" IS NULL`);
        await queryRunner.query(`ALTER TABLE "proposals" ALTER COLUMN "offerAddress" SET NOT NULL`);
    }

}
