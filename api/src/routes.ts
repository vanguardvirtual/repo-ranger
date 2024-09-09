import express from 'express';
import { createUsername, getUsernames, refreshScore, getUsernameById, searchUsernames } from '@/controller';

export const router = express.Router();

router.post('/create', createUsername);
router.get('/', getUsernames);
router.get('/refresh/:id', refreshScore);
router.get('/single/:id', getUsernameById);
router.get('/search', searchUsernames);
