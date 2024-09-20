import eventsService from '@services/events.service';
import { EventDTO } from '@Itypes/events.interface';
import { GithubEvent } from '@models/github-events.model';

jest.mock('@models/github-events.model');

describe('Events Service', () => {
  describe('createEvent', () => {
    it('should create an event', async () => {
      const data: EventDTO = {
        username_id: 1,
        github_repo_id: 1,
        event_type: 'push',
        event_size: 100,
        github_id: '1234567890',
        message: 'Test event',
        event_date: new Date(),
      };
      const event = await eventsService.createEvent(data);
      expect(event).toBeDefined();
    });
  });

  describe('getEventsByUsername', () => {
    it('should get events by username', async () => {
      const mockEvents = [
        {
          id: 1,
          username_id: 1,
          repo_id: 1,
          event_type: 'push',
          event_size: 100,
          github_id: '1234567890',
          message: 'Test event',
          event_date: new Date(),
        },
      ];
      (GithubEvent.find as jest.Mock).mockResolvedValue(mockEvents);

      const events = await eventsService.getEventsByUsername(1);
      expect(events).toBeDefined();
    });
  });

  describe('getEventsByRepo', () => {
    it('should get events by repo', async () => {
      const mockEvents = [
        {
          id: 1,
          username_id: 1,
          repo_id: 1,
          event_type: 'push',
          event_size: 100,
          github_id: '1234567890',
          message: 'Test event',
          event_date: new Date(),
        },
      ];
      (GithubEvent.find as jest.Mock).mockResolvedValue(mockEvents);

      const events = await eventsService.getEventsByRepo(1);
      expect(events).toBeDefined();
    });
  });

  describe('getTodayEvents', () => {
    it('should get today events', async () => {
      const mockEvents = [
        {
          id: 1,
          username_id: 1,
          repo_id: 1,
          event_type: 'push',
          event_size: 100,
          github_id: '1234567890',
          message: 'Test event',
          event_date: new Date(),
        },
        {
          id: 2,
          username_id: 2,
          repo_id: 2,
          event_type: 'pull_request',
          event_size: 200,
          github_id: '1234567891',
          message: 'Test event 2',
          event_date: new Date(),
        },
      ];
      (GithubEvent.find as jest.Mock).mockResolvedValue(mockEvents);

      const events = await eventsService.getTodayEvents();
      expect(events).toBeDefined();
    });
  });

  describe('createMultipleEvents', () => {
    it('should create multiple events', async () => {
      const mockEvents = [
        {
          id: 1,
          username_id: 1,
          repo_id: 1,
          event_type: 'push',
          event_size: 100,
          github_id: '1234567890',
          message: 'Test event',
          event_date: new Date(),
        },
      ];
      (GithubEvent.find as jest.Mock).mockResolvedValue(mockEvents);
      const eventsToSave = mockEvents.map((event) => {
        const newEvent = new GithubEvent();
        newEvent.username_id = event.username_id;
        newEvent.github_repo_id = event.repo_id;
        newEvent.event_type = event.event_type;
        newEvent.event_size = event.event_size;
        newEvent.github_id = event.github_id;
        newEvent.message = event.message;
        newEvent.event_date = event.event_date;
        return newEvent;
      });
      const events = await eventsService.createMultipleEvents(eventsToSave);
      expect(events).toBeDefined();
    });
  });
});
