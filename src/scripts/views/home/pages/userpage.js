import firebaseConfig from "../../../globals/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, getFirestore, query, where, getDocs } from "firebase/firestore";

const userPage = {
    async render(){
        return `<div class="container-xl">
        <div class="table-responsive">
            <div class="table-wrapper">
                <div class="table-title">
                    <div class="row">
                        <div class="col-sm-6">
                            <h2>Tabel <b>Perintah Lembur</b></h2>
                        </div>
                        <div class="col-sm-6">
                            <a class="btn btn-success" data-toggle="modal"><span>120 MENIT</span></a>
                        </div>
                    </div>
                </div>
                <table class="table table-striped table-hover" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Tanggal Lembur</th>
                            <th>Jam Lembur</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id='bodyTable'>
                        <tr>
                            <td>Thomas Hardy</td>
                            <td>thomashardy@mail.com</td>
                            <td>28 April 2002</td>
                            <td>17.00 - 18.00</td>
                            <td>
                                <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                            </td>
                        </tr> 
                    </tbody>
                </table>
            </div>
        </div>        
    </div>
    </div>
    </div>
    </div>
    <!-- Delete Modal HTML -->
    <div id="deleteEmployeeModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <form>
                    <div class="modal-header">						
                        <h4 class="modal-title">Delete Perintah Lembur</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">					
                        <p>Are you sure you want to delete these Records?</p>
                        <p class="text-warning"><small>This action cannot be undone.</small></p>
                    </div>
                    <div class="modal-footer">
                        <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel">
                        <input type="submit" class="btn btn-danger" value="Delete">
                    </div>
                </form>
            </div>
        </div>
    </div>`
    },

    async afterRender(){
        $(document).ready(function() {
            let table = $('#dataTable').DataTable({
                "columnDefs": [
                    { "width": "20%", "targets": 0}
                ],
                 'order': [[1, 'asc']]
            });
          });

        const app = initializeApp(firebaseConfig)
        const db = getFirestore(app)

        const initializeData = query(collection(db, "user"), where("role", "!=", "admin"))
        const userData = await getDocs(initializeData)
        userData.forEach(user => {
            console.log(user.id, '=>', user.data());
        });

          
        
    }
}
export default userPage;