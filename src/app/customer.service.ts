import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Customer } from './customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  url = 'http://localhost:58480';
  constructor(private http:HttpClient) { }

  getAllCustomer(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url + '/api/customer');
  }

  getCustomerById(custId: string): Observable<Customer> {
    return this.http.get<Customer>(this.url + '/api/customer/' + custId);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.post<Customer>(this.url + '/api/customer', customer, httpOptions);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.put<Customer>(this.url + '/api/customer', customer, httpOptions);
  }

  deleteCustomer(custId: string): Observable<string> {
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.delete<string>(this.url + '/api/customer?id=' + custId, httpOptions);
  }
}
