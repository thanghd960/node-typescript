import { UserCredentialsDbAccess } from "../Authorization/UserCredentialsDbAccess";
import { UsersDbAccess } from "../User/UsersDbAccess";

class DbTest {
    public dbAccess: UserCredentialsDbAccess = new UserCredentialsDbAccess();
    public userDbAccess: UsersDbAccess = new UsersDbAccess();
}

// new DbTest().dbAccess.putUserCredential({
//     username: 'thanghua',
//     password: 'Admin@123',
//     accessRights: [1,2,3]
// });

new DbTest().userDbAccess.putUser({
    id: '1312-1245-3312-12312',
    email: 'huadaithang@gmail.com',
    age: 25,
    name: 'Thang Hua',
    workingPossition: 1
});