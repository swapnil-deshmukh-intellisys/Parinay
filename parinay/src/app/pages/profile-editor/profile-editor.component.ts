import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProfilesService } from '../../services/profiles.service';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-editor.component.html'
})
export class ProfileEditComponent implements OnInit {
  profileForm = new FormGroup<{
    name: FormControl<string | null>;
    age: FormControl<number | null>;
    gender: FormControl<string | null>;
    religion: FormControl<string | null>;
    location: FormControl<string | null>;
    caste: FormControl<string | null>;
  }>({
    name: new FormControl<string | null>(null),
    age: new FormControl<number | null>(null),
    gender: new FormControl<string | null>(null),
    religion: new FormControl<string | null>(null),
    location: new FormControl<string | null>(null),
    caste: new FormControl<string | null>(null),
  });

  profileId!: string;
  selectedFile: File | null = null;

  constructor(
    private profilesService: ProfilesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.profileId = this.route.snapshot.paramMap.get('id')!;
    this.profilesService.getProfiles().subscribe(profiles => {
      const profile = profiles.find(p => p._id === this.profileId);
      if (profile) {
        this.profileForm.patchValue({
          name: profile.name ?? null,
          age: profile.age ?? null,
          gender: profile.gender ?? null,
          religion: profile.religion ?? null,
          location: profile.location ?? null,
          caste: profile.caste ?? null
        });
      }
    });
  }

  onFileSelected(event: Event) {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0] || null;
  }

  saveProfile() {
    const formData = this.profileForm.value as Partial<Profile>;

    this.profilesService.updateProfile(this.profileId, formData).subscribe();

    if (this.selectedFile) {
      const uploadData = new FormData();
      uploadData.append('photo', this.selectedFile);
      this.profilesService.uploadPhoto(this.profileId, uploadData).subscribe();
    }
  }
}
