import { buildSchema } from "graphql";

export const schema = buildSchema(`
    enum UserRole {
        User
        Admin
    }

    enum NumberOfEmployees {
        small
        medium
        large
    }

    type ProfilePic {
        secure_url: String
        public_id: String
    }

    type CoverPic {
        secure_url: String
        public_id: String
    }

    type LegalAttachment {
        secure_url: String
        public_id: String
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        username: String!
        email: String!
        gender: String!
        DOB: String!
        mobileNumber: String!
        role: UserRole!
        isConfirmed: Boolean!
        profilePic: ProfilePic
        coverPic: CoverPic
        bannedAt: String
        deletedAt: String
        createdAt: String!
        updatedAt: String!
    }

    type Company {
        id: ID!
        companyName: String!
        description: String!
        industry: String!
        address: String!
        numberOfEmployees: NumberOfEmployees
        companyEmail: String!
        createdBy: User!
        logo: ProfilePic
        coverPic: CoverPic
        HRs: [User]
        bannedAt: String
        deletedAt: String
        legalAttachment: LegalAttachment
        approvedByAdmin: Boolean!
        createdAt: String!
        updatedAt: String!
        jobs: [Job]
    }

    type Job {
        id: ID!
        title: String!
        description: String!
        companyId: Company!
        createdAt: String!
        updatedAt: String!
    }

    type Query {
        getAllData: DataResponse!
    }

    type DataResponse {
        users: [User!]!
        companies: [Company!]!
    }
`);
