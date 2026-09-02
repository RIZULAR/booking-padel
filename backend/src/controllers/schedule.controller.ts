import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getOperatingHours = async (req: Request, res: Response): Promise<void> => {
  try {
    const hours = await prisma.operatingHours.findMany({ orderBy: { day: 'asc' } });
    res.json({ success: true, data: hours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const updateOperatingHours = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: 'Invalid schedule ID' });
      return;
    }
    const { openTime, closeTime, isClosed } = req.body;
    const hours = await prisma.operatingHours.update({
      where: { id },
      data: { openTime, closeTime, isClosed }
    });
    res.json({ success: true, data: hours });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const getBlockedSchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const blocks = await prisma.blockedSchedule.findMany({ include: { court: true } });
    res.json({ success: true, data: blocks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const createBlockedSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId, date, startTime, endTime, reason } = req.body;
    const block = await prisma.blockedSchedule.create({
      data: { courtId, date: new Date(date), startTime, endTime, reason }
    });
    res.status(201).json({ success: true, data: block });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const deleteBlockedSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: 'Invalid schedule ID' });
      return;
    }
    await prisma.blockedSchedule.delete({ where: { id } });
    res.json({ success: true, message: 'Blocked schedule removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};
