function randomPagePlugin() {
  function isMac() {
    return window.navigator.platform.startsWith('Mac');
  }

  // settings
  const title = 'RANDOM';
  const icon = 'bp3-button bp3-minimal bp3-icon-random pointer bp3-small';
  const shortcut = isMac() ? {ctrlKey: true, key: "r"} : {altKey: true, key: "r"};

  function addButton() {
    // cleanup old versions of the button
    var randomButton = document.querySelector('#random-button');
    if (randomButton != null) {
      randomButton.parentNode.removeChild(randomButton);
    }
    // create button
    var template = document.createElement('template');
    template.innerHTML = '<div href="#" class="log-button"><div class="flex-h-box" style="align-items: center; justify-content: space-between;"><span class="' + icon + '"></span>' + title + '</div></div>'
    template.content.firstChild.onclick = goToRandomPage;
    randomButton = template.content.firstChild;

    // insert button into topbar
    const sidebar = document.querySelector('.roam-sidebar-content');
    const starred = document.querySelector('.roam-sidebar-content .starred-pages-wrapper');
    sidebar.insertBefore(randomButton, starred);
  }

  function addKeyboardShortcut() {
    document.onkeyup = function(e) {
      if (shortcut.ctrlKey && !e.ctrlKey) return;
      if (shortcut.shiftKey && !e.shiftKey) return;
      if (shortcut.altKey && !e.altKey) return;
      if (shortcut.key === e.key) goToRandomPage(e);
    }
  }

  function goToRandomPage(e) {
    if (isAllPages()) {
      clickRandomPageLink(e.shiftKey);
    } else if (e.shiftKey) {
      goToAllPagesThen(function() {
        clickRandomPageLink(e.shiftKey);
        history.back();
      });
    } else {
      const allPages = roamAlphaAPI.q('[ :find (pull ?e [:block/uid]) :where [?e :node/title]]');
      const page = getRandomElement(allPages);
      const uid = page[0].uid;
      const db = location.hash.split('/')[2];
      location.assign('/#/app/' + db + '/page/' + uid);
    }
  }

  function isAllPages() {
    return location.hash.endsWith('/search');
  }

  function goToAllPagesThen(f) {
    document.querySelector('.bp3-icon-list').parentNode.parentNode.click();
    setTimeout(f, 0);
  }

  function clickRandomPageLink(shift) {
    // https://forum.roamresearch.com/t/what-would-be-your-top-3-tips-for-beginners/255/9
    var allPages = document.querySelectorAll('div.rm-pages-title-col a');
    var pageLink = getRandomElement(allPages);
    getEventHandlers(pageLink).onClick({ shiftKey: shift });
  }

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getEventHandlers(element) {
    for (var prop in element) {
      if (prop.includes('reactEventHandlers')) {
        return element[prop];
      }
    }
  }

  addButton();
  addKeyboardShortcut();
}
setTimeout(randomPagePlugin, 1000);
