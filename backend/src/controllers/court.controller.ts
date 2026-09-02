import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { checkAvailability } from '../services/booking.service';

export const getPublicCourts = async (req: Request, res: Response): Promise<void> => {
  try {
    const queryDate = (typeof req.query.date === 'string' ? req.query.date : null) || new Date().toISOString().split('T')[0];
    const courts = await prisma.court.findMany({
      where: { status: 'active' },
      include: { images: true, pricing: true }
    });

    const enrichedCourts = await Promise.all(courts.map(async (court) => {
      const slots = await checkAvailability(court.id, queryDate as string);
      const availableSlots = slots.filter(s => s.isAvailable);
      const nextSlot = availableSlots[0]?.startTime || null;

      return {
        ...court,
        availableSlotsCount: availableSlots.length,
        totalSlotsCount: slots.length,
        nextAvailableSlot: nextSlot
      };
    }));

    res.json({ success: true, data: enrichedCourts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const getPublicCourtDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: 'Invalid court ID' });
      return;
    }
    const court = await prisma.court.findUnique({
      where: { id },
      include: { images: true, pricing: true }
    });
    if (!court || court.status !== 'active') {
      res.status(404).json({ success: false, message: 'Court not found' });
      return;
    }
    res.json({ success: true, data: court });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const getAdminCourts = async (req: Request, res: Response): Promise<void> => {
  try {
    const courts = await prisma.court.findMany({
      include: { images: true }
    });
    res.json({ success: true, data: courts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const createCourt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, type, indoor, capacity, status } = req.body;
    
    if (!name || !type) {
      res.status(422).json({ success: false, message: 'Missing required fields' });
      return;
    }

    const court = await prisma.court.create({
      data: { name, description: description || '', type, indoor: indoor ?? true, capacity: capacity ?? 4, status: status || 'active' }
    });
    res.status(201).json({ success: true, data: court });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};

export const updateCourt = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: 'Invalid court ID' });
      return;
    }
    const { name, description, type, indoor, capacity, status } = req.body;
    
    const court = await prisma.court.update({
      where: { id },
      data: { name, description, type, indoor, capacity, status }
    });
    res.json({ success: true, data: court });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update court' });
  }
};

export const deleteCourt = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: 'Invalid court ID' });
      return;
    }
    await prisma.court.update({
      where: { id },
      data: { status: 'inactive' } // soft delete
    });
    res.json({ success: true, message: 'Court deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
};
