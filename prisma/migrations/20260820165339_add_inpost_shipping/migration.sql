/*
  Warnings:

  - A unique constraint covering the columns `[inpostShipmentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inpostTrackingNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ShippingProvider" AS ENUM ('INPOST');

-- CreateEnum
CREATE TYPE "ShippingMethod" AS ENUM ('INPOST_LOCKER', 'INPOST_POINT', 'HOME_DELIVERY');

-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('NOT_CREATED', 'READY_TO_CREATE', 'CREATED', 'LABEL_READY', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'ERROR');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "inpostLabelUrl" TEXT,
ADD COLUMN     "inpostPointAddress" TEXT,
ADD COLUMN     "inpostPointId" TEXT,
ADD COLUMN     "inpostPointName" TEXT,
ADD COLUMN     "inpostShipmentId" TEXT,
ADD COLUMN     "inpostStatus" TEXT,
ADD COLUMN     "inpostTrackingNumber" TEXT,
ADD COLUMN     "labelCreatedAt" TIMESTAMP(3),
ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "shippingCreatedAt" TIMESTAMP(3),
ADD COLUMN     "shippingMethod" "ShippingMethod",
ADD COLUMN     "shippingProvider" "ShippingProvider",
ADD COLUMN     "shippingStatus" "ShippingStatus" NOT NULL DEFAULT 'NOT_CREATED';

-- CreateIndex
CREATE UNIQUE INDEX "Order_inpostShipmentId_key" ON "Order"("inpostShipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_inpostTrackingNumber_key" ON "Order"("inpostTrackingNumber");

-- CreateIndex
CREATE INDEX "Order_shippingProvider_idx" ON "Order"("shippingProvider");

-- CreateIndex
CREATE INDEX "Order_shippingMethod_idx" ON "Order"("shippingMethod");

-- CreateIndex
CREATE INDEX "Order_shippingStatus_idx" ON "Order"("shippingStatus");

-- CreateIndex
CREATE INDEX "Order_inpostPointId_idx" ON "Order"("inpostPointId");

-- CreateIndex
CREATE INDEX "Order_inpostStatus_idx" ON "Order"("inpostStatus");
