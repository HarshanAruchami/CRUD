function loadTable() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/Products");
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
          object["avatar"] +
          '" class="avatar"></td>';
        trHTML +=
          '<td><button type="button" class="btn btn-outline-secondary ms-2" onclick="showUserEditBox(' +
          object["id"] +
          ')">Edit</button>';
        trHTML +=
          '<button type="button" class="btn btn-outline-danger ms-2" onclick="userDelete(' +
          object["id"] +
          ')">Del</button></td>';
        trHTML += "</tr>";
      }
      document.getElementById("mytable").innerHTML = trHTML;
    }
  };
}

loadTable();

function showUserCreateBox() {
  Swal.fire({
    title: "Add New Products",
    html:
      '<input id="id" type="hidden">' +
      '<input id="Product_Name" class="swal2-input" placeholder="Product_Name">' +
      '<input id="Product_Type" class="swal2-input" placeholder="Product_Type">' +
      '<input id="Quantity" class="swal2-input" placeholder="Quantity">' +
      '<input id="Price" class="swal2-input" placeholder="Price">' +
      '<input id="Image" class="form-control swa4l1-input mt-4" type="file" >',
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
  const image = document.getElementById("Image").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:3000/Products/");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      Product_Name: pname,
      Product_Type: ptype,
      Quantity: qty,
      Price: price,
      Image: image,
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects["message"]);
      loadTable();
    }
  };
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
          '<input id="Product_Type" class="swal2-input" placeholder="type" value="' +
          objects["Product_Type"] +
          '">' +
          '<input id="Quantity" class="swal2-input" placeholder="qty" value="' +
          objects["Quantity"] +
          '">' +
          '<input id="Price" class="swal2-input" placeholder="price" value="' +
          objects["Price"] +
          '">'+
          '<input id="Image" class="swal2-input" placeholder="image" value="' +
          objects["Image"] +
          '">' ,
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
  const image = document.getElementById("Image").value;
  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", `http://localhost:3000/Products/${id}`);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      Product_Name: pname,
      Product_Type: ptype,
      Quantity: qty,
      Price: price,
      Image: image
    })
  );
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(objects["message"]);
      loadTable();
    }
  };
}
function userDelete(id) {
  console.log(id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", `http://localhost:3000/Products/${id}`);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  Swal.fire({
    title: "Are you sure?",
    text: "It will get deleted permanently!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
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
          loadTable();
        }
      };
    }
  });
}
