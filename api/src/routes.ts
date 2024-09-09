import express from 'express';
import { createUsername, getUsernames, refreshScore, getUsernameById } from '@/controller';

export const router = express.Router();

router.post('/create', createUsername);
router.get('/', getUsernames);
router.get('/refresh/:id', refreshScore);
router.get('/:id', getUsernameById);
