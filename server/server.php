<?php
// Enable CORS for all origins
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];

    // Check if the file is a CSV file
    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
    if ($fileExtension === 'csv') {
        // Define the directory to store uploaded files
        $uploadDirectory = 'uploads/';

        // Create the directory if it doesn't exist
        if (!file_exists($uploadDirectory)) {
            mkdir($uploadDirectory, 0777, true);
        }

        // Move the uploaded file to the server
        $targetFilePath = $uploadDirectory . basename($file['name']);
        move_uploaded_file($file['tmp_name'], $targetFilePath);

        $datasetFilePath = 'server/uploads/' . basename($file['name']);
        // Send the file path back to the client
        echo json_encode(['filePath' => $datasetFilePath]);
    } else {
        // Invalid file type
        http_response_code(400);
        echo 'Invalid file type. Please upload a CSV file.';
    }
}
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Assuming the file path is sent in the request body
    $data = json_decode(file_get_contents("php://input"));
    $filePathToDelete = $data->filePath;

    // Use realpath to resolve the path (if there are symbolic links)
    $realPath = realpath($filePathToDelete);

    if ($realPath && file_exists($realPath)) {
        unlink($realPath);
        echo 'File deleted successfully.';
    } else {
        http_response_code(404);
        echo 'File not found.';
    }
}
