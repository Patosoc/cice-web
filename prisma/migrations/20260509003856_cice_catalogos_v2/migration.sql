/*
  Warnings:

  - You are about to drop the column `ciudad` on the `Institucion` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Institucion` table. All the data in the column will be lost.
  - Added the required column `id_ciudad` to the `Institucion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_tipo` to the `Institucion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Institucion" DROP COLUMN "ciudad",
DROP COLUMN "tipo",
ADD COLUMN     "id_ciudad" TEXT NOT NULL,
ADD COLUMN     "id_tipo" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "tipo_inst" (
    "id_tipo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "tipo_inst_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "ciudad" (
    "id_ciudad" TEXT NOT NULL,
    "name_ciudad" TEXT NOT NULL,

    CONSTRAINT "ciudad_pkey" PRIMARY KEY ("id_ciudad")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipo_inst_nombre_key" ON "tipo_inst"("nombre");

-- AddForeignKey
ALTER TABLE "Institucion" ADD CONSTRAINT "Institucion_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "tipo_inst"("id_tipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institucion" ADD CONSTRAINT "Institucion_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "ciudad"("id_ciudad") ON DELETE RESTRICT ON UPDATE CASCADE;
