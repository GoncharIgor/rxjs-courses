import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {CoursesService} from '../services/courses.service';
import {LoadingService} from '../loading/loading.service';
import {MessagesService} from '../messages/messages.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

/*@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [
        LoadingService,  // will give its instance to template's <loading>
        MessagesService
    ]
})*/
export class CourseDialogComponent {
    editCourseForm: FormGroup;
    course: Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course,
        private coursesService: CoursesService,
        private loadingService: LoadingService,
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

        const saveCourse$ = this.coursesService.saveCourse(this.course.id, changes).pipe(
            catchError(error => {
                const message = 'Could not save course';
                console.log(message, error);
                this.messagesService.showErrors(message);

                return throwError(error);
            })
        );

        this.loadingService.showLoaderUntilCompleted(saveCourse$).subscribe((response) => {
            this.dialogRef.close(response); // we pass data to f() to distinguish this close() f(), from below one, without any data passed
        });
    }

    close() {
        this.dialogRef.close();
    }
}
