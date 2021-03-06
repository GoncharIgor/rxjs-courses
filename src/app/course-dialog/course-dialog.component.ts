import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {LoadingService} from '../loading/loading.service';
import {MessagesService} from '../messages/messages.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {CoursesStoreService} from '../services/courses-store.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [
        LoadingService,  // will give its instance to template's <loading>
        MessagesService
    ]
})
export class CourseDialogComponent {
    editCourseForm: FormGroup;
    course: Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course,
        private coursesStore: CoursesStoreService,
        private messagesService: MessagesService) {

        this.course = course;

        this.editCourseForm = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription, Validators.required]
        });
    }

    save() {
        const changes = this.editCourseForm.value;

        this.coursesStore.saveCourse(this.course.id, changes).subscribe();

        this.dialogRef.close(changes);
    }

    close() {
        this.dialogRef.close();
    }
}
