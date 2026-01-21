import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfilesService } from './profiles.service';
import { Profile } from '../models/profile.model';
import { getHttpTestingController, flushHttpRequests } from '../testing/test-utils';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let httpMock: HttpTestingController;
  const baseUrl = '/api/profiles';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfilesService]
    });
    service = TestBed.inject(ProfilesService);
    httpMock = getHttpTestingController();
  });

  afterEach(() => {
    flushHttpRequests();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProfiles', () => {
    it('should fetch all profiles', () => {
      const mockProfiles: Profile[] = [
        {
          _id: '1',
          name: 'Test User 1',
          age: 28,
          gender: 'Male',
          email: 'test1@example.com',
          location: 'Mumbai'
        },
        {
          _id: '2',
          name: 'Test User 2',
          age: 25,
          gender: 'Female',
          email: 'test2@example.com',
          location: 'Delhi'
        }
      ];

      service.getProfiles().subscribe(profiles => {
        expect(profiles).toEqual(mockProfiles);
        expect(profiles.length).toBe(2);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProfiles);
    });

    it('should handle empty profiles list', () => {
      service.getProfiles().subscribe(profiles => {
        expect(profiles).toEqual([]);
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush([]);
    });
  });

  describe('addProfile', () => {
    it('should create a new profile', () => {
      const newProfile: Partial<Profile> = {
        name: 'New User',
        age: 30,
        gender: 'Male',
        email: 'new@example.com'
      };

      const createdProfile: Profile = {
        _id: '123',
        ...newProfile as Profile
      };

      service.addProfile(newProfile as Profile).subscribe(profile => {
        expect(profile).toEqual(createdProfile);
        expect(profile._id).toBeDefined();
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProfile);
      req.flush(createdProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update an existing profile', () => {
      const profileId = '123';
      const updates: Partial<Profile> = {
        name: 'Updated Name',
        bio: 'Updated bio'
      };

      const updatedProfile: Profile = {
        _id: profileId,
        name: 'Updated Name',
        age: 30,
        gender: 'Male',
        bio: 'Updated bio'
      };

      service.updateProfile(profileId, updates).subscribe(profile => {
        expect(profile).toEqual(updatedProfile);
        expect(profile.name).toBe(updates.name);
        expect(profile.bio).toBe(updates.bio);
      });

      const req = httpMock.expectOne(`${baseUrl}/${profileId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      req.flush(updatedProfile);
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile', () => {
      const profileId = '123';

      service.deleteProfile(profileId).subscribe(response => {
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${baseUrl}/${profileId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });
  });

  describe('uploadPhoto', () => {
    it('should upload a photo for a profile', () => {
      const profileId = '123';
      const formData = new FormData();
      formData.append('photo', new Blob(['test']), 'test.jpg');

      const mockResponse = { photoURL: 'https://example.com/photo.jpg' };

      service.uploadPhoto(profileId, formData).subscribe(response => {
        expect(response.photoURL).toBe(mockResponse.photoURL);
      });

      const req = httpMock.expectOne(`${baseUrl}/${profileId}/photo`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is logged in', () => {
      const user = service.getCurrentUser();
      expect(user).toBeNull();
    });
  });
});
