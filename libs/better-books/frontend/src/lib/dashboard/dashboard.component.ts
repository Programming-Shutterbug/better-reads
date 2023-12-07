import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user/user.service';
import { IUser } from '@nx-emma-indiv/shared/api';

@Component({
    selector: 'nx-emma-indiv-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
    user: IUser | null = null;
    selectedLeesstatus: string | null = null;

    constructor(
        private userService: UserService, 
        private route: ActivatedRoute,
        ) {}

        ngOnInit(): void {
            // Retrieve user ID from route parameter
            const userId = this.route.snapshot.paramMap.get('_id');
    
            // Fetch the user with booklist
            if (userId) {
                this.userService.findOneWithBooklist(userId).subscribe(
                    (userWithBooklist: IUser) => {
                        this.user = userWithBooklist;
                    },
                    (error) => {
                        console.error('Error fetching user with booklist:', error);
                    }
                );
            }
        }

        getFormattedLeesstatus(leesstatus: string): string {
            switch (leesstatus) {
              case 'READ':
                return 'gelezen';
              case 'TO_READ':
                return 'nog te lezen';
              case 'DNF':
                return 'DNF (Did Not Finish)';
              default:
                return leesstatus;
            }
        }

        getStatusBoxColor(leesstatus: string): string {
          switch (leesstatus) {
            case 'gelezen':
            case 'READ':
              return '#93e69f';
        
            case 'nog te lezen':
            case 'TO_READ':
              return '#f2c394';
        
            case 'dnf':
            case 'DNF':
              return '#f59a9a';
        
            default:
              return '#f0f0f0';
          }
        }

        applyLeesstatusFilter(leesstatus: string | null): void {
            if (leesstatus === 'ALL') {
              this.selectedLeesstatus = null;
            } else {
              this.selectedLeesstatus = leesstatus;
            }
          }

        getFilteredBooksCount(): number {
            if (!this.user || !this.user.boekenlijst) {
              return 0;
            }
          
            if (this.selectedLeesstatus === null) {
              return this.user.boekenlijst.length;
            }
          
            return this.user.boekenlijst.filter(book => book.leesstatus === this.selectedLeesstatus).length;
          }
}
