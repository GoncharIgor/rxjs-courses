import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {CoursesService} from '../services/courses.service';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {LoadingService} from '../loading/loading.service';
import {MessagesService} from '../messages/messages.service';

export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;


    constructor(private coursesService: CoursesService,
                private loadingService: LoadingService,
                private messagesService: MessagesService) {
    }

    ngOnInit() {
        this.reloadCourses();
    }

    reloadCourses() {
        // this.loadingService.loadingOn();

        const courses$ = this.coursesService.loadAllCourses().pipe(
            map(courses => courses.sort(sortCoursesBySeqNo)),
            catchError(err => {
                // we need to provide a new observable, that will replace a failed ones
                const message = 'Could not load courses';
                this.messagesService.showErrors(message);
                console.log(message, err);
                // terminating our initial loadAllCourses() observable chain
                return throwError(err);
            })
            // fiyudnalize(() => this.loadingService.loadingOff())
        );

        // instead of approach with loadingOn() and finalize() for showing spinner
        const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

        this.beginnerCourses$ = loadCourses$.pipe(
            map(courses => courses.filter(course => course.category === 'BEGINNER'))
        );
        this.advancedCourses$ = loadCourses$.pipe(
            map(courses => courses.filter(course => course.category === 'ADVANCED'))
        );
    }
}




