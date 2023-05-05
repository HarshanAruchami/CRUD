//search function
function loadTable(Product_Name = "") {
  const xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    `http://localhost:3000/Products?Product_Name_like=${Product_Name}`
  );
  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var trHTML = "";
      const objects = JSON.parse(this.responseText);
      for (let object of objects) {
        trHTML += "<tr>";
        trHTML += "<td>" + object["id"] + "</td>";
        trHTML += "<td>" + object["Product_Name"] + "</td>";
        trHTML += "<td>" + object["Product_Type"] + "</td>";
        trHTML += "<td>" + object["Quantity"] + "</td>";
        trHTML += "<td>" + object["Price"] + "</td>";
        trHTML +=
          '<td><img width="50px" src="' +
          object["Image"] +
          '" class="avatar"></td>';
        trHTML +=
          '<td><button type="button" class="btn btn-outline-secondary ms-2" onclick="showUserEditBox(' +
          object["id"] +
          ')"><i class="fa-solid fa-pen-to-square text-dark " style="color: #ffffff;"></i></button>';
        trHTML +=
          '<button type="button" class="btn btn-outline-secondary ms-2" onclick="userDelete(' +
          object["id"] +
          ')"><i class="fa-regular fa-trash-can text-dark style="color: #ffffff;"></i></button></td>';
        trHTML += "</tr>";
      }
      document.getElementById("mytable").innerHTML = trHTML;
    }
  };
}

loadTable();
// searching
function search() {
  const empname = document.getElementById("searchvalue").value;
  loadTable(empname);
}

function showUserCreateBox() {
  Swal.fire({
    title: "Add New Products",
    html:
      '<input id="id" type="hidden">' +
      '<input id="Product_Name" class="swal2-input" placeholder="Product_Name">' +
      '<select name="country" id="Product_Type" placeholder="Product_Type"  class="swal2-input" style="width:270px"><option value="" selected disabled> Product_Type </option><option value="Groceries">Groceries</option><option value="Electronics">Electronics</option><option value="Accessories ">Accessories</option>' +
      '<input id="Quantity" class="swal2-input" placeholder="Quantity">' +
      '<input id="Price" class="swal2-input" placeholder="Price">' +
      '<input id="Image" class="form-control swa4l1-input mt-4" type="file">',
    preConfirm: () => {
      userCreate();
    },
  });
}

function userCreate() {
  const pname = document.getElementById("Product_Name").value;
  const ptype = document.getElementById("Product_Type").value;
  const qty = document.getElementById("Quantity").value;
  const price = document.getElementById("Price").value;
  const image = document.getElementById("Image");
  const file = "assets/images/" + image.files[0].name;

  if (validation() == true) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/Products/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
        Product_Name: pname,
        Product_Type: ptype,
        Quantity: qty,
        Price: price,
        Image: file,
      })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        loadTable();
      }
    };
  }
}

function showUserEditBox(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", `http://localhost:3000/Products/${id}`);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      //const user = objects["objects"];
      console.log(objects);
      Swal.fire({
        title: "EDIT PRODUCTS",
        html:
          '<input id="id" type="hidden" value="' +
          objects[`${id}`] +
          '">' +
          '<input id="Product_Name" class="swal2-input" placeholder="name" value="' +
          objects["Product_Name"] +
          '">' +
          '<select name="country" id="Product_Type" placeholder="Product_Type"  class="swal2-input" style="width:270px"><option selected disabled> Product_Type </option><option value="Groceries">Groceries</option><option value="Electronics">Electronics</option><option value="Accessories ">Accessories</option>' +
          '<input id="Quantity" class="swal2-input" placeholder="qty" value="' +
          objects["Quantity"] +
          '">' +
          '<input id="Price" class="swal2-input" placeholder="price" value="' +
          objects["Price"] +
          '">' +
          '<input id="Image" type="file" class="form-control swa4l1-input mt-4" placeholder="image" value="' +
          objects["Image"] +
          '">',
        preConfirm: () => {
          userEdit(id);
        },
      });
    }
  };
}

function userEdit(id) {
  //const id = document.getElementById("id").value;
  const pname = document.getElementById("Product_Name").value;
  const ptype = document.getElementById("Product_Type").value;
  const qty = document.getElementById("Quantity").value;
  const price = document.getElementById("Price").value;
  const image = document.getElementById("Image");
  const file = "assets/images/" + image.files[0].name;

  if (validation2() == true) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `http://localhost:3000/Products/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
      JSON.stringify({
        Product_Name: pname,
        Product_Type: ptype,
        Quantity: qty,
        Price: price,
        Image: file,
      })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        loadTable();
      }
    };
  }
}
function userDelete(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", `http://localhost:3000/Products/${id}`);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  Swal.fire({
    title: "Are you sure?",
    text: "Product will get deleted permanently!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "red",
    cancelButtonColor: "grey",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.value) {
      xhttp.send(
        JSON.stringify({
          id: id,
        })
      );
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          Swal.fire({
            title: "Deleted successfully",
            icon: "success",
            confirmButtonText: "Ok"
          });
          loadTable();
        }
      };
    }
  });
}
function validation2() {
  const pname = document.getElementById("Product_Name").value;
  const ptype = document.getElementById("Product_Type").value;
  const qty = document.getElementById("Quantity").value;
  const price = document.getElementById("Price").value;
  const file = document.getElementById("Image").value;
  //regex
  const pnameCheck = /^[a-zA-Z\d\s]{2,20}$/;
  const ptypeCheck = /^[a-zA-Z\d\s]{2,20}$/;
  const pqtyCheck = /^[a-zA-Z\d\s]{1,20}$/;

  if (pname == "" || ptype == "" || qty == "" || price == "" || file == "") {
    Swal.fire({
      title: "Fields should not be left empty",
      showConfirmButton: true,
      icon: "error",
    });
    return false;
  }

  if (!pname.match(pnameCheck)) {
    Swal.fire({
      title: "Invalid Input",
      text: "Product Name can be letter or number",
      icon: "error",
      showConfirmButton: true,
    });
    return false;
  }

  if (!ptype.match(ptypeCheck)) {
    Swal.fire({
      title: "Invalid Input",
      text: "Product Type can be letter or number",
      icon: "error",
      showConfirmButton: true,
    });
    return false;
  }
  if (!qty.match(pqtyCheck)) {
    Swal.fire({
      title: "Invalid Input",
      text: "Quantity can be letter or number",
      icon: "error",
      showConfirmButton: true,
    });
    return false;
  }

  if (pname.match(pnameCheck) && ptype.match(ptypeCheck)) {
    Swal.fire({
      title: "Successfully edited",
      icon: "success",
      showConfirmButton: true,
    });
    return true;
  }
}
function validation() {
  const pname = document.getElementById("Product_Name").value;
  const ptype = document.getElementById("Product_Type").value;
  const qty = document.getElementById("Quantity").value;
  const price = document.getElementById("Price").value;
  const file = document.getElementById("Image").value;
  //regex
  const pnameCheck = /^[a-zA-Z\d\s]{2,20}$/;
  const ptypeCheck = /^[a-zA-Z\d\s]{2,20}$/;
  const pqtyCheck = /^[a-zA-Z\d\s]{1,20}$/;

  if (pname == "" || ptype == "" || qty == "" || price == "" || file == "") {
    Swal.fire({
      title: "Fields should not be left empty",
      showConfirmButton: true,
      icon: "error",
    });
    return false;
  }

  if (!pname.match(pnameCheck)) {
    Swal.fire({
      title: "Invalid Input",
      text: "Product Name can be letter or number",
      icon: "error",
      showConfirmButton: true,
    });
    return false;
  }

  if (!ptype.match(ptypeCheck)) {
    Swal.fire({
      title: "Invalid Input",
      text: "Product Type can be letter or number",
      icon: "error",
      showConfirmButton: true,
    });
    return false;
  }
  if (!qty.match(pqtyCheck)) {
    Swal.fire({
      title: "Invalid Input",
      text: "Quantity can be letter or number",
      icon: "error",
      showConfirmButton: true,
    });
    return false;
  }

  if (pname.match(pnameCheck) && ptype.match(ptypeCheck)) {
    Swal.fire({
      title: "Successfully Created",
      icon: "success",
      showConfirmButton: true,
    });
    return true;
  }
}
