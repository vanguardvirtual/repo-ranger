import { EventDTO } from '@Itypes/events.interface';
import { GithubEvent } from '@models/github-events.model';
import { In, MoreThanOrEqual } from 'typeorm';

const createEvent = async (event: EventDTO) => {
  const newEvent = new GithubEvent();

  newEvent.username_id = event.username_id;
  newEvent.github_repo_id = event.github_repo_id;
  newEvent.event_type = event.event_type;
  newEvent.event_size = event.event_size;
  newEvent.github_id = event.github_id;
  newEvent.message = event.message;
  newEvent.event_date = event.event_date;

  await newEvent.save();

  return newEvent;
};

const createMultipleEvents = async (events: GithubEvent[]) => {
  const githubIds = events.map((event) => event.github_id);
  const existingEvents = await GithubEvent.find({ where: { github_id: In(githubIds) } });
  const existingGithubIds = new Set(existingEvents.map((event) => event.github_id));

  const newEvents = events
    .filter((event) => !existingGithubIds.has(event.github_id))
    .map((event) => {
      const newEvent = new GithubEvent();
      newEvent.username_id = event.username_id;
      newEvent.github_repo_id = event.github_repo_id;
      newEvent.event_type = event.event_type;
      newEvent.event_size = event.event_size;
      newEvent.github_id = event.github_id;
      newEvent.message = event.message;
      newEvent.event_date = event.event_date;
      newEvent.created_at = event.created_at;
      return newEvent;
    });

  await GithubEvent.save(newEvents);
  return newEvents;
};

const getEventsByUsername = async (username_id: number) => {
  const events = await GithubEvent.find({ where: { username_id: username_id } }); // Convert to number
  return events;
};

const getEventsByRepo = async (repo_id: number) => {
  const events = await GithubEvent.find({ where: { github_repo_id: repo_id } }); // Convert to number
  return events;
};

const getTodayEvents = async () => {
  const events = await GithubEvent.find({
    where: { created_at: MoreThanOrEqual(new Date(new Date().setHours(0, 0, 0, 0))) },
  });
  return events;
};

export default { createEvent, getEventsByUsername, getEventsByRepo, getTodayEvents, createMultipleEvents };
