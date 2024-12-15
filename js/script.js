function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const wrapper = document.getElementById("wrapper");

  sidebar.classList.remove("collapsed");
  wrapper.classList.remove("uncollapsed");

}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.add("collapsed");
  wrapper.classList.add("uncollapsed");
}

function showContributors() {
  document.getElementById("contributors").style.display = "block";
}

function closeContributors() {
  document.getElementById("contributors").style.display = "none";
}
