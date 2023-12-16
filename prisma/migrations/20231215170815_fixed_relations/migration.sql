-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `Tasks_taskID_fkey`;

-- AlterTable
ALTER TABLE `tasks` MODIFY `taskID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_taskID_fkey` FOREIGN KEY (`taskID`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
