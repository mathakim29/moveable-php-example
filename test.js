const element$3 = document.querySelector(`[data-croffle-ref="element$3"]`);

let groupManager = new MoveableHelper.GroupManager([]);
let targets = [];
let moveableRef = null;
let selectoRef = null;
const cubes = [];

for (let i = 0; i < 3; ++i) {
  cubes.push(i);
}
const setSelectedTargets = (nextTargetes) => {
  selectoRef.setSelectedTargets(nextTargetes.flat());

  setTargets(nextTargetes);
};

const element$0 = document.querySelector(`[data-croffle-ref="element$0"]`);
const element$1 = document.querySelector(`[data-croffle-ref="element$1"]`);
const element$2 = document.querySelector(`[data-croffle-ref="element$2"]`);
const element$4 = document.querySelector(`[data-croffle-ref="element$4"]`);

element$3.innerHTML = cubes
  .map((i) => {
    return `<div x=${i} class="cube" autocomplete="off" contenteditable="true">${i}</div>`;
  })
  .join("\n");

const containerWidth = element$3.getBoundingClientRect().width;
const containerheight = element$3.getBoundingClientRect().height;

moveableRef = new Moveable(element$3, {
  draggable: true,
  scalable: true,
  rotatable: true,
  snappable: true,
  snapCenter: true,
  snapVertical: true,
  snapHorizontal: true,
  snapElement: true,
  snapGap: true,
  keepRatio: true,
  verticalGuidelines: [
    { pos: containerWidth / 2, className: "container-lines" },
  ],
  horizontalGuidelines: [
    { pos: containerheight / 2, className: "container-lines" },
  ],
  elementGuidelines: [...document.querySelectorAll(".cube"), element$3],
  bounds: element$3,
});

// locked objects test
["dragStart", "scaleStart", "rotateStart"].forEach((eventName) => {
  moveableRef.on(eventName, (e) => {
    if (e.target.classList.contains("locked")) {
      e.stop();
    }
  });
});

selectoRef = new Selecto({
  container: document.querySelector(`[data-croffle-ref="selectoRef"]`),
  dragContainer: window,
  selectableTargets: [".selecto-area .cube"],
  hitRate: 0,
  selectByClick: true,
  selectFromInside: false,
  toggleContinueSelect: ["shift"],
  ratio: 0,
});
function setTargets(nextTargets) {
  targets = nextTargets;
  moveableRef.target = targets;
}
element$1.addEventListener("click", () => {
  const nextGroup = groupManager.group(targets, true);
  if (nextGroup) setTargets(nextGroup);
});

element$2.addEventListener("click", () => {
  const group = groupManager.groups.find((g) =>
    g.targets().includes(targets[0]),
  );
  if (group) {
    const nextTargets = groupManager.ungroup(group);
    setTargets(nextTargets);
  } else {
    console.warn("No group found to ungroup");
  }
});
moveableRef.on("drag", (e) => {
  e.target.style.transform = e.transform;
});

moveableRef.on("scale", (e) => {
  e.target.style.transform = e.transform;
});

moveableRef.on("scaleGroup", (e) => {
  e.target.style.transform = e.transform;
});

moveableRef.on("clickGroup", (e) => {
  if (!e.moveableTarget) {
    setSelectedTargets([]);
    return;
  }
  if (e.isDouble) {
    const childs = groupManager.selectSubChilds(targets, e.moveableTarget);
    setSelectedTargets(childs.targets());
    return;
  }
  if (e.isTrusted) {
    selectoRef.clickTarget(e.inputEvent, e.moveableTarget);
  }
});

selectoRef.on("dragStart", (e) => {
  const moveable = moveableRef;
  const target = e.inputEvent.target;
  const flatted = targets.flat();

  if (
    target.tagName === "BUTTON" ||
    moveable.isMoveableElement(target) ||
    flatted.some((t) => t === target || t.contains(target))
  ) {
    e.stop();
  }
  e.data.startTargets = targets;
});
selectoRef.on("select", (e) => {
  const { startAdded, startRemoved, isDragStartEnd } = e;

  if (isDragStartEnd) {
    return;
  }
  const nextChilds = groupManager.selectSameDepthChilds(
    e.data.startTargets,
    startAdded,
    startRemoved,
  );

  setSelectedTargets(nextChilds.targets());
});
selectoRef.on("selectEnd", (e) => {
  const { isDragStartEnd, added, removed, inputEvent, isClick } = e;
  const moveable = moveableRef;
  if (isDragStartEnd) {
    inputEvent.preventDefault();
    moveable.waitToChangeTarget().then(() => {
      moveable.dragStart(inputEvent);
    });
  }
  let nextChilds;

  if (isDragStartEnd || isClick) {
    nextChilds = groupManager.selectCompletedChilds(targets, added, removed);
  } else {
    nextChilds = groupManager.selectSameDepthChilds(targets, added, removed);
  }
  e.currentTarget.setSelectedTargets(nextChilds.flatten());
  setSelectedTargets(nextChilds.targets());
});

const elements = selectoRef.getSelectableElements();

const observer = new ResizeObserver(() => {
  if (moveableRef) moveableRef.updateRect();
});

document.querySelectorAll(".cube").forEach((el) => observer.observe(el));

groupManager.set([], elements);

element$5.addEventListener("click", () => {
  moveableRef?.targets = [];
  selectoRef?.setSelectedTargets([]);
});
