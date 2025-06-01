// src/api/userApi.ts
import axios from 'axios';

const API_BASE = 'http://185.217.131.96:4958'; // adjust if needed

/**
 * Fetch a single user by username.
 */
export const getUser = async (username: string) => {
  const { data } = await axios.get(`${API_BASE}/users/${username}`);
  return data;
};

/**
 * Patch (partial update) for a user.
 * `payload` is a subset of:
 * { waterDepth, height, totalLitres, totalElectricity, motorState, timerRemaining, lastTimerTime, lastHeartbeat }
 */
export const patchUser = async (
  username: string,
  payload: Partial<{
    waterDepth: number;
    height: number;
    totalLitres: number;
    totalElectricity: number;
    motorState: 'on' | 'off';
    timerRemaining: string; // "HH:MM"
    lastTimerTime: string; // ISO
    lastHeartbeat: string; // ISO
  }>
) => {
  const { data } = await axios.patch(`${API_BASE}/users/${username}`, payload);
  return data;
};
