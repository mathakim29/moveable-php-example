        <script src="https://daybrush.com/moveable/helper/release/latest/dist/helper.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moveable/0.53.0/moveable.min.js" integrity="sha512-gFIuV9WCEJeWYkY1ZdJXugypot9ooEtwJf6U8In5JR6z5ZvV1xAvAQe9mQ7IYBXiF9ICXyiCeqgCJzqf64wh7A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/selecto/1.26.3/selecto.min.js" integrity="sha512-LyYhmSJ2wilC9RjVXIC+Iq22nFVFTdTa5J/qGRJv42bmSEpHA0j1wQvdzu53MBG1Wuse7SP1BJp8lIzdBmsIDQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>



<div class="root">
    <div
        class="container"
        data-croffle-ref="element$0"
    >
        <button data-croffle-ref="element$1">Group</button>
        &nbsp;
        <button data-croffle-ref="element$2">Ungroup</button>
        <div data-croffle-ref="selectoRef"></div>
        <div
            class="elements selecto-area"
            data-croffle-ref="element$3"
        ></div>
        <div class="empty elements"></div>
    </div>
</div>

<script>
let groupManager = new MoveableHelper.GroupManager([]);
let targets = [];
let moveableRef = null;
let selectoRef = null;
const cubes = [];
for (let i = 0; i < 30; ++i) {
    cubes.push(i);
}
const setSelectedTargets = (nextTargetes) => {
    selectoRef.setSelectedTargets(deepFlat(nextTargetes));
    setTargets(nextTargetes);
};
const element$0 = document.querySelector(`[data-croffle-ref="element$0"]`);
const element$1 = document.querySelector(`[data-croffle-ref="element$1"]`);
const element$2 = document.querySelector(`[data-croffle-ref="element$2"]`);
const element$3 = document.querySelector(`[data-croffle-ref="element$3"]`);
element$3.innerHTML = cubes.map(i => {
    return `<div class="cube">${i}</div>`;
}).join("\n");
moveableRef = new Moveable(element$0, {
    draggable: true,
    rotatable: true,
    scalable: true,
    target: targets
});
selectoRef = new Selecto({
    container: document.querySelector(`[data-croffle-ref="selectoRef"]`),
    dragContainer: window,
    selectableTargets: [".selecto-area .cube"],
    hitRate: 0,
    selectByClick: true,
    selectFromInside: false,
    toggleContinueSelect: ["shift"],
    ratio: 0
});
function setTargets(nextTargets) {
    targets = nextTargets;
    moveableRef.target = targets;
}
element$1.addEventListener("click", () => {
    const nextGroup = groupManager.group(targets, true);
    if (nextGroup) {
        setTargets(nextGroup);
    }
});
element$2.addEventListener("click", () => {
    const nextGroup = groupManager.ungroup(targets);
    if (nextGroup) {
        setTargets(nextGroup);
    }
});
moveableRef.on("drag", e => {
    e.target.style.transform = e.transform;
});
moveableRef.on("renderGroup", e => {
    e.events.forEach(ev => {
        ev.target.style.cssText += ev.cssText;
    });
});
moveableRef.on("clickGroup", e => {
    if (!e.moveableTarget) {
        setSelectedTargets([]);
        return;
    }
    if (e.isDouble) {
        const childs = groupManager.selectSubChilds(
            targets,
            e.moveableTarget
        );
        setSelectedTargets(childs.targets());
        return;
    }
    if (e.isTrusted) {
        selectoRef.clickTarget(e.inputEvent, e.moveableTarget);
    }
});
selectoRef.on("dragStart", e => {
    const moveable = moveableRef;
    const target = e.inputEvent.target;
    const flatted = MoveableHelper.deepFlat(targets);
    if (target.tagName === "BUTTON" || moveable.isMoveableElement(target)
        || flatted.some(t => t === target || t.contains(target))
    ) {
        e.stop();
    }
    e.data.startTargets = targets;
});
selectoRef.on("select", e => {
    const { startAdded, startRemoved, isDragStartEnd } = e;
    if (isDragStartEnd) {
        return;
    }
    const nextChilds = groupManager.selectSameDepthChilds(
        e.data.startTargets,
        startAdded,
        startRemoved
    );
    setSelectedTargets(nextChilds.targets());
});
selectoRef.on("selectEnd", e => {
    const { isDragStartEnd, isClick, added, removed, inputEvent } = e;
    const moveable = moveableRef;
    if (isDragStartEnd) {
        inputEvent.preventDefault();
        moveable.waitToChangeTarget().then(() => {
            moveable.dragStart(inputEvent);
        });
    }
    let nextChilds;
    if (isDragStartEnd || isClick) {
        nextChilds = groupManager.selectCompletedChilds(
            e.data.startTargets,
            added,
            removed
        );
    } else {
        nextChilds = groupManager.selectSameDepthChilds(
            e.data.startTargets,
            added,
            removed
        );
    }
    e.currentTarget.setSelectedTargets(nextChilds.flatten());
    setSelectedTargets(nextChilds.targets());
});
const elements = selectoRef.getSelectableElements();
groupManager.set([], elements);

</script>
