let groupManager = new MoveableHelper.GroupManager([]);
let targets = [];
let moveableRef = null;
let selectoRef = null;
const cubes = [];
for (let i = 0; i < 30; ++i) {
  cubes.push(i);
}
const setSelectedTargets = (nextTargetes) => {
  selectoRef.setSelectedTargets(nextTargetes.flat());

  setTargets(nextTargetes);
};
const element$0 = document.querySelector(`[data-croffle-ref="element$0"]`);
const element$1 = document.querySelector(`[data-croffle-ref="element$1"]`);
const element$2 = document.querySelector(`[data-croffle-ref="element$2"]`);
const element$3 = document.querySelector(`[data-croffle-ref="element$3"]`);

const bound = document.querySelector(`.user-canvas`);

const containerWidth = bound.getBoundingClientRect().width;
const containerHeight = bound.getBoundingClientRect().height;

element$3.innerHTML = cubes
  .map((i) => {
    return `<div class="absolute cube">${i}</div>`;
  })
  .join("\n");

moveableRef = new Moveable(bound, {
  draggable: true,
  scalable: true,
  rotatable: true,
  snappable: true,
  snapElement: true,
  snapGap: true,
  keepRatio: true,
  snapDirections: {
    top: true,
    bottom: true,
    right: true,
    left: true,
    center: true,
    middle: true,
  },
  verticalGuidelines: [
    { pos: containerWidth / 2, className: "container-lines" },
  ],
  horizontalGuidelines: [
    { pos: containerHeight / 2, className: "container-lines" },
  ],
  elementGuidelines: [...document.querySelectorAll(".cube"), bound],
  bounds: bound,
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
  selectableTargets: [" .cube"],
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
moveableRef.on("drag", (e) => {
  e.target.style.transform = e.transform;
});
moveableRef.on("renderGroup", (e) => {
  e.events.forEach((ev) => {
    ev.target.style.cssText += ev.cssText;
  });
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

  e.stop();
});

const elements = selectoRef.getSelectableElements();

groupManager.set([], elements);

const observer = new ResizeObserver(() => {
  if (moveableRef) moveableRef.updateRect();
});
