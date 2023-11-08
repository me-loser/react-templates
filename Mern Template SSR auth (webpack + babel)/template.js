export default ({ markup }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval';">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MERN Skeleton</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400"><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div id='root'>${markup}</div>
    <script type="text/javascript" src="/dist/bundle.js"></script>
</body>
</html>`;
};
