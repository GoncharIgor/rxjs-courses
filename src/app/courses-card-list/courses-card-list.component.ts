import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Course} from '../model/course';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import {filter, tap} from 'rxjs/operators';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesCardListComponent implements OnInit {
    @Input() courses: Course[] = [];
    // @Output() private coursesChanged = new EventEmitter();

    constructor(private dialog: MatDialog) {
    }

    ngOnInit(): void {
    }

    editCourse(course: Course) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = course;

        const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

        // Observable, that emits values when Dialog is closed
        dialogRef.afterClosed().pipe(
            filter(val => !!val), // only where value is present (we return value in dialog close() f())
           // tap(() => this.coursesChanged.emit())
        ).subscribe();
    }
}
