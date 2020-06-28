import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {combineLatest, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {CoursesStoreService} from '../services/courses-store.service';
import {map, startWith, tap} from 'rxjs/operators';

interface CourseData {
    course: Course;
    lessons: Lesson[];
}

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {
    data$: Observable<CourseData>;

    constructor(private route: ActivatedRoute,
                private coursesStore: CoursesStoreService) {
    }

    ngOnInit() {
        const courseId = +this.route.snapshot.paramMap.get('courseId');

        const course$ = this.coursesStore.loadCourseById(courseId).pipe(
            startWith(null) // emits initial value, so combineLatest() further will emit values for any of 2 Obs updated
        );
        const lessons$ = this.coursesStore.loadAllCourseLessons(courseId).pipe(
            startWith(null)
        );

        // give data to template as soon as it is available. If 1 obs is ready - its given to template, while 2-nd is still loading
        // the 1-st emit will contain the 1-st observable
        // 2-nd emit will contain value of both Observables
        // but for initial emit, it still will wait for 2 Observables to emit their first value
        // and then if any of them changes - it will emit values for both of them
        this.data$ = combineLatest([course$, lessons$]).pipe(
            map(([course, lessons]) => {
                return {
                    course,
                    lessons
                };
            }),
            // tap(console.log)
        );
    }
}
