import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getPricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const pricing = await prisma.pricing.findMany({ include: { court: true } });
    res.json({ success: true, data: pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const createPricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courtId, dayType, startTime, endTime, price } = req.body;
    const pricing = await prisma.pricing.create({
      data: { courtId, dayType, startTime, endTime, price }
    });
    res.status(201).json({ success: true, data: pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const updatePricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: 'Invalid pricing ID' });
      return;
    }
    const { dayType, startTime, endTime, price } = req.body;
    const pricing = await prisma.pricing.update({
      where: { id },
      data: { dayType, startTime, endTime, price }
    });
    res.json({ success: true, data: pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const deletePricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: 'Invalid pricing ID' });
      return;
    }
    await prisma.pricing.delete({ where: { id } });
    res.json({ success: true, message: 'Pricing rule deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};
