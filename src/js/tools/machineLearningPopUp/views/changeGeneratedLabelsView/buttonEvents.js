import {
  postProcessSpacesInTextElement, updateGeneratedLabelsElementWidth,
  displayHighlightedDefaultEditLabelButton, displayRedEditButtonIfActiveTextEmpty,
  displayGreyedDefaultEditLabelButton, editMachineLearningLabel, setActiveRowToDefault,
} from './style';

function MLLabelTextKeyDown(event) {
  if (event.key === 'Enter') {
    setActiveRowToDefault();
  } else {
    window.setTimeout(() => {
      if (event.code === 'Space') { postProcessSpacesInTextElement(); }
      updateGeneratedLabelsElementWidth();
      displayRedEditButtonIfActiveTextEmpty();
    }, 1);
  }
}

function registerButtonEventHandlers(nextViewCallback) {
  // window.next = nextViewCallback;
  window.MLLabelTextKeyDown = MLLabelTextKeyDown;
  window.displayMachineLearningPopUpEditLabelButton = displayHighlightedDefaultEditLabelButton;
  window.hideMachineLearningPopUpEditLabelButton = displayGreyedDefaultEditLabelButton;
  window.editMachineLearningLabel = editMachineLearningLabel;
}

export { registerButtonEventHandlers as default };
