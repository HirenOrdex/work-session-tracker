import { Request, Response } from 'express';
import Session from '../models/WorkSession';
import logger from '../utils/logger'; // Your custom winston logger

interface CustomRequest extends Request {
  user: {
    id: string;
  };
}

export const startSession = async (req: any, res: any) => {
  try {
    logger.info(`Start session requested by user ${req.user.id}`);
    const existing = await Session.findOne({ userId: req.user.id, endTime: null });
    if (existing) {
      logger.warn(`User ${req.user.id} already has an active session`);
      return res.status(400).json({ error: "Session already active" });
    }
    const session = await Session.create({
      userId: req.user.id,
      startTime: new Date(),
      breaks: [],
      checkedOutAutomatically: false,
    });
    logger.info(`Session started: ${session._id}`);
    res.json(session);
  } catch (error: any) {
    logger.error(`Error in startSession: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const endSession = async (req: any, res: any) => {
  try {
    const session = await Session.findOneAndUpdate(
      { userId: req.user.id, endTime: null },
      { endTime: new Date() },
      { new: true }
    );
    if (!session) {
      logger.warn(`No active session to end for user ${req.user.id}`);
      return res.status(404).json({ error: "No active session" });
    }
    logger.info(`Session ended: ${session._id}`);
    res.json(session);
  } catch (error: any) {
    logger.error(`Error in endSession: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const startBreak = async (req: any, res: any) => {
  try {
    const session = await Session.findOne({ userId: req.user.id, endTime: null });
    if (!session) {
      logger.warn(`No active session found for break start - user ${req.user.id}`);
      return res.status(404).json({ error: "No active session" });
    }

    const activeBreak = session.breaks.find(b => !b.end);
    if (activeBreak) {
      logger.warn(`User ${req.user.id} already on break`);
      return res.status(400).json({ error: "Break already active" });
    }

    session.breaks.push({ start: new Date(), end: null });
    await session.save();
    logger.info(`Break started for session ${session._id}`);
    res.json(session);
  } catch (error: any) {
    logger.error(`Error in startBreak: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const endBreak = async (req: any, res: any) => {
  try {
    const session = await Session.findOne({ userId: req.user.id, endTime: null });
    if (!session) {
      logger.warn(`No active session for user ${req.user.id}`);
      return res.status(404).json({ error: "No active session" });
    }

    const lastBreak = session.breaks[session.breaks.length - 1];
    if (!lastBreak || lastBreak.end) {
      logger.warn(`No active break to end for user ${req.user.id}`);
      return res.status(400).json({ error: "No active break" });
    }

    lastBreak.end = new Date();
    await session.save();
    logger.info(`Break ended for session ${session._id}`);
    res.json(session);
  } catch (error: any) {
    logger.error(`Error in endBreak: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export const getActiveSession = async (req: any, res: any) => {
  try {
    const session = await Session.findOne({ userId: req.user.id, endTime: null });
    if (!session) {
      logger.warn(`No active session found for user ${req.user.id}`);
      return res.status(404).json({ error: "No active session" });
    }
    logger.info(`Active session fetched for user ${req.user.id}`);
    console.log(JSON.stringify(session));
    res.json(session);
  } catch (error: any) {
    logger.error(`Error in getActiveSession: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
