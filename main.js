$(document).ready(function () {
  // Fetch JSON data using AJAX request
  $.ajax({
    url: "file.json",
    dataType: "json",
    success: function (data) {
      // Process the JSON data and generate the treeview
      var treeviewHtml = buildTreeHtml(data);
      $("#treeviewContainer").html(treeviewHtml);
    },
    error: function () {
      console.log("Failed to fetch JSON data.");
    },
  });

  // Function to generate the treeview HTML
  function buildTreeHtml(data) {
    var treeviewHtml = "<ul>";

    // Iterate over the JSON data and generate the treeview nodes
    $.each(data, function (index, node) {
      treeviewHtml += "<li><a href='#'>" + node.name + "</a>";

      if (node.children && node.children.length > 0) {
        treeviewHtml += "<ul class='hidden'></ul>";
      }

      treeviewHtml += "</li>";
    });

    treeviewHtml += "</ul>";

    return treeviewHtml;
  }

  // Add event listener for collapsing/expanding nodes
  $("#treeviewContainer").on("click", "li > a", function (e) {
    e.preventDefault();
    e.stopPropagation();

    var parentLi = $(this).parent("li");
    var childUl = parentLi.children("ul");

    if (childUl.length > 0) {
      // Child nodes are already loaded, toggle visibility
      childUl.toggleClass("hidden");
    } else {
      // Child nodes not loaded, fetch them using AJAX
      var parentId = parentLi.index();
      fetchChildNodes(parentId, parentLi);
    }
  });

  // Function to fetch child nodes using AJAX
  function fetchChildNodes(parentId, parentLi) {
    $.ajax({
      url: "file.json",
      dataType: "json",
      success: function (data) {
        // Filter child nodes based on parent ID
        var childNodes = data.filter(function (node) {
          return node.parent === parentId;
        });

        // Process the child nodes and generate the HTML
        var childHtml = buildTreeHtml(childNodes);
        parentLi.append("<ul>" + childHtml + "</ul>");
        parentLi.children("ul").removeClass("hidden");
      },
      error: function () {
        console.log("Failed to fetch child nodes.");
      },
    });
  }
});
