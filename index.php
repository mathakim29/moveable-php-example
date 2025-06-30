<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Moveable Group &amp; Ungroup</title>
        <link rel="stylesheet" href="./style.css" />
    </head>
    <body>

        <div>
        <div>
            <button data-croffle-ref="element$1">Group</button>
            &nbsp;
            <button data-croffle-ref="element$2">Ungrooup</button>
        </div>





        <div class="user-area-bg flex justify-center items-center ">
            <!-- USER CONTROLS -->
            <!-- partial:index.partial.html -->
            <div class="user-canvas container shadow-md ">
                <div class="root">
                    <div  data-croffle-ref="element$0">

                        <div data-croffle-ref="selectoRef"></div>
                        <div
                            class="elements selecto-area"
                            data-croffle-ref="element$3"
                        ></div>
                        <div class="empty elements"></div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <!-- partial -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moveable/0.48.0/moveable.min.js"></script>
        <script src="https://daybrush.com/selecto/release/latest/dist/selecto.js"></script>
        <script src="https://daybrush.com/moveable/helper/release/latest/dist/helper.js"></script>
        <script type="module" src="./script.js"></script>
           <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    </body>
</html>
