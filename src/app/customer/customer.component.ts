import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm!: FormGroup;
  allCustomers: Observable<Customer[]>;
  showAdd!: boolean;
  showUpdate!: boolean;
  customerIdUpdate = "";

  constructor(private formbulider: FormBuilder, private customerService: CustomerService) { }

  ngOnInit() {
    this.customerForm = this.formbulider.group({
      CustName: [null, [Validators.required]],
      CustEmail: [null, [Validators.required, Validators.email]],
      Address: [null, [Validators.required]],
      PostCode: [null, [Validators.required]],
      PhoneNumber: [null, [Validators.required, Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$')]],
    });
    this.loadAllCustomers();
  }

  loadAllCustomers() {
    this.allCustomers = this.customerService.getAllCustomer();
  }

  onFormSubmit() {
    const customer = this.customerForm.value;
    this.createCustomer(customer);
    this.customerForm.reset();
  }

  onCreate() {
    this.resetForm();
    this.showAdd = true;
    this.showUpdate = false;
  }

  loadCustomer(row: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.customerIdUpdate = row.CustId;
    this.customerForm.controls['CustName'].setValue(row.CustName);
    this.customerForm.controls['PhoneNumber'].setValue(row.PhoneNumber);
    this.customerForm.controls['CustEmail'].setValue(row.CustEmail);
    this.customerForm.controls['Address'].setValue(row.Address);
    this.customerForm.controls['PostCode'].setValue(row.PostCode);
  }

  createCustomer(customer: Customer) {
    let ref = document.getElementById('cancel');
    this.customerService.createCustomer(customer).subscribe({
      error: (e) => {
        Swal.fire(
          'Error!',
          e.message,
          'error'
        )
      },
      complete: () => {
        this.loadAllCustomers();
        this.customerIdUpdate = "";
        ref?.click();
        this.customerForm.reset();
        Swal.fire(
          'Added',
          'Record has been Added.',
          'success'
        )
      }
    }
    );
  }

  updateCustomer(customer: Customer) {
    customer.CustId = this.customerIdUpdate;
    let ref = document.getElementById('cancel');
    this.customerService.updateCustomer(customer).subscribe({
      error: (e) => {
        Swal.fire(
          'Error!',
          e.message,
          'error'
        )
      },
      complete: () => {
        this.loadAllCustomers();
        ref?.click();
        this.customerForm.reset();
        Swal.fire(
          'Updated',
          'Record has been updated.',
          'success'
        )
      }
    }
    );
  }

  deleteCustomer(customerId: string) {
    Swal.fire({
      title: 'Warning!',
      text: 'Do you want to continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#5cb85c',
      cancelButtonColor: '#d9534f'
    }).then((result) => {
      if (result.value) {
        this.customerService.deleteCustomer(customerId).subscribe({
          error: (e) => {
            Swal.fire(
              'Error!',
              e.message,
              'error'
            )
          },
          complete: () => {
            this.loadAllCustomers();
            this.customerIdUpdate = "";
            this.customerForm.reset();
            Swal.fire(
              'Deleted',
              'Record has been deleted.',
              'success'
            )
          }
        }
        );
      }
    })
  }

  resetForm() {
    this.customerForm.reset();
  }
}
