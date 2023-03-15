import { Job } from "./Job"

export class Customer {
    id: number
    name: string
    email: string
    phone: string
    address: string
    jobs: Job[]

    constructor(id: number, name: string, email: string, phone: string, address: string, jobs: Job[]) {
        this.id = id
        this.name = name
        this.email = email
        this.phone = phone
        this.address = address
        this.jobs = jobs
    }
  }