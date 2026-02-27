import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1772215099714 implements MigrationInterface {
    name = 'Init1772215099714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "character" integer NOT NULL DEFAULT '0', "role" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_tasks" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "completed" boolean NOT NULL DEFAULT false, "projectId" integer, CONSTRAINT "PK_b1b6204912a6f44133df3a4518b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "status" "public"."projects_status_enum" NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "responsible_id" integer, "goalsAgility" integer NOT NULL DEFAULT '0', "goalsEnchantment" integer NOT NULL DEFAULT '0', "goalsEfficiency" integer NOT NULL DEFAULT '0', "goalsExcellence" integer NOT NULL DEFAULT '0', "goalsTransparency" integer NOT NULL DEFAULT '0', "goalsAmbition" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project_tasks" ADD CONSTRAINT "FK_8691c10b6396e041f4b6d48f8a0" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_d6100a3090c9318a41798ddf40c" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_d6100a3090c9318a41798ddf40c"`);
        await queryRunner.query(`ALTER TABLE "project_tasks" DROP CONSTRAINT "FK_8691c10b6396e041f4b6d48f8a0"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`DROP TABLE "project_tasks"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
