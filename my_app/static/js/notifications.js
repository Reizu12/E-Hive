document.addEventListener("DOMContentLoaded", () => {
    const notificationIcons = document.querySelectorAll("#notification-icon");
    const notificationModal = document.getElementById("notification-modal");

    // Attach event listeners to all notification icons
    notificationIcons.forEach((icon) => {
        icon.addEventListener("click", () => {
            if (notificationModal.style.display === "block") {
                notificationModal.style.display = "none";
            } else {
                notificationModal.style.display = "block";
            }
        });
    });

    // Close the modal when clicking outside
    window.addEventListener("click", (event) => {
        if (
            event.target !== notificationModal &&
            !Array.from(notificationIcons).includes(event.target) && // Check if the clicked target is not any of the icons
            !notificationModal.contains(event.target)
        ) {
            notificationModal.style.display = "none";
        }
    });
});
