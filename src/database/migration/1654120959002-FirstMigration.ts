import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1654120959002 implements MigrationInterface {
  name = 'FirstMigration1654120959002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "endpoint" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "title" character varying NOT NULL, "http_method" character varying NOT NULL, "route" character varying NOT NULL, "description" character varying, "route_type" character varying NOT NULL, "apiId" uuid, CONSTRAINT "PK_7785c5c2cf24e6ab3abb7a2e89f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "discussion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "author" character varying NOT NULL, "body" character varying NOT NULL, "apiId" uuid, CONSTRAINT "PK_b93169eb129e530c6a4c3b9fda1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tutorial" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "title" character varying NOT NULL, "body" character varying NOT NULL, CONSTRAINT "PK_4d07a72cfa203b3b21bde6da1b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pricing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "planName" character varying NOT NULL, "planPrice" character varying NOT NULL, "requestDuration" character varying NOT NULL, CONSTRAINT "PK_4f6e9c88033106a989aa7ce9dee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "price_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "apiId" uuid, "pricingId" uuid, CONSTRAINT "REL_11608f5bfd1ff9485e35a5e36a" UNIQUE ("pricingId"), CONSTRAINT "PK_baf66b2acb03206fb76891bbb48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "user_id" character varying NOT NULL, "email" character varying NOT NULL, "picture" character varying NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "category" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_dab3b9cd30b5940f3a808316991" UNIQUE ("category"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "api" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "api_name" character varying NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL, "base_url" character varying NOT NULL, "subscribers" character varying, "popularity" integer DEFAULT '0', "about" character varying, "verified" character varying NOT NULL DEFAULT false, "rating" integer DEFAULT '0', "tutorialsId" uuid, "categoryId" uuid, "profileId" uuid, CONSTRAINT "UQ_fc7dbce3f828c6b5954f5177715" UNIQUE ("api_name"), CONSTRAINT "REL_a97d009aa61e38179387196950" UNIQUE ("profileId"), CONSTRAINT "PK_12f6cbe9e79197c2bf4c79c009d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organisation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "name" character varying(200) NOT NULL, "number_of_seats" integer NOT NULL DEFAULT '4', "number_of_employees" character varying, "mail_extension" character varying, "price_per_month" integer NOT NULL DEFAULT '0', "profileId" uuid, CONSTRAINT "UQ_d9428f9c8e3052d6617e3aab0ed" UNIQUE ("name"), CONSTRAINT "REL_037ba4b170844c039e74aa22ec" UNIQUE ("profileId"), CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."profile_org_role_enum" AS ENUM('admin', 'developer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile_org" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "role" "public"."profile_org_role_enum" NOT NULL DEFAULT 'developer', "organisationId" uuid, "profileId" uuid, CONSTRAINT "PK_b1458cef545c7429a278d89d7d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "endpoint" ADD CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discussion" ADD CONSTRAINT "FK_2b60252641016810191dfbb6a1e" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_group" ADD CONSTRAINT "FK_78a5352493260ea77604c25399f" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_group" ADD CONSTRAINT "FK_11608f5bfd1ff9485e35a5e36a6" FOREIGN KEY ("pricingId") REFERENCES "pricing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "api" ADD CONSTRAINT "FK_bca892ad0e22921095b4bbd767a" FOREIGN KEY ("tutorialsId") REFERENCES "tutorial"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "api" ADD CONSTRAINT "FK_85a54167d077f66ff2612ebb62c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "api" ADD CONSTRAINT "FK_a97d009aa61e381793871969509" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" ADD CONSTRAINT "FK_037ba4b170844c039e74aa22ecd" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_org" ADD CONSTRAINT "FK_767a37e586746f3f9aaeb53d2bb" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_org" ADD CONSTRAINT "FK_432b14a27261ea8d706826424a9" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile_org" DROP CONSTRAINT "FK_432b14a27261ea8d706826424a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile_org" DROP CONSTRAINT "FK_767a37e586746f3f9aaeb53d2bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organisation" DROP CONSTRAINT "FK_037ba4b170844c039e74aa22ecd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api" DROP CONSTRAINT "FK_a97d009aa61e381793871969509"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api" DROP CONSTRAINT "FK_85a54167d077f66ff2612ebb62c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "api" DROP CONSTRAINT "FK_bca892ad0e22921095b4bbd767a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_group" DROP CONSTRAINT "FK_11608f5bfd1ff9485e35a5e36a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "price_group" DROP CONSTRAINT "FK_78a5352493260ea77604c25399f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discussion" DROP CONSTRAINT "FK_2b60252641016810191dfbb6a1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "endpoint" DROP CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701"`,
    );
    await queryRunner.query(`DROP TABLE "profile_org"`);
    await queryRunner.query(`DROP TYPE "public"."profile_org_role_enum"`);
    await queryRunner.query(`DROP TABLE "organisation"`);
    await queryRunner.query(`DROP TABLE "api"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "profile"`);
    await queryRunner.query(`DROP TABLE "price_group"`);
    await queryRunner.query(`DROP TABLE "pricing"`);
    await queryRunner.query(`DROP TABLE "tutorial"`);
    await queryRunner.query(`DROP TABLE "discussion"`);
    await queryRunner.query(`DROP TABLE "endpoint"`);
  }
}
