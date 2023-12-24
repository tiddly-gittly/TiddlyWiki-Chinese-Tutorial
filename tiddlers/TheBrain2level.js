const Categories = [
  {
    name: 'Focusing',
  },
  {
    name: 'History',
  },
  {
    name: 'Link To',
  },
  {
    name: 'Backlink From',
  },
  {
    name: 'Tag To',
  },
  {
    name: 'Tag By',
  },
  {
    name: 'Parent',
  },
];

exports.onMount = function (echart) {
  var state = {
    historyTiddlers: [],
  };
  echart.on('click', function (event) {
    if (event.dataType === 'node') {
      new $tw.Story().navigateTiddler(event.data.name);
    } else if (event.dataType === 'edge') {
    }
  });
  return state;
};

exports.shouldUpdate = function (_, changedTiddlers) {
  return $tw.utils.count(changedTiddlers) > 0;
};

exports.onUpdate = function (echart, state) {
  var focussedTiddler = $tw.wiki.getTiddlerText('$:/temp/focussedTiddler');
  if (focussedTiddler && focussedTiddler.startsWith('$:/')) return;
  var nodes = [];
  var edges = [];
  if (focussedTiddler && focussedTiddler !== '') {
    var nodeMap = {};
    nodeMap[''] = true;

    // 当前关注的 Tiddler
    nodeMap[focussedTiddler] = true;
    nodes.push({
      name: focussedTiddler,
      // fixed: true,
      category: 0,
    });

    // 历史路径
    var nextTiddler = focussedTiddler;
    var historyMap = {};
    for (var i = state.historyTiddlers.length - 2; i >= 0; i--) {
      var tiddlerTitle = state.historyTiddlers[i];
      if (historyMap[tiddlerTitle]) continue;
      if (tiddlerTitle === nextTiddler) continue;
      if (tiddlerTitle.startsWith('$:/')) continue;
      edges.push({
        source: tiddlerTitle,
        target: nextTiddler,
        label: {
          show: true,
          formatter: 'history',
        },
      });
      historyMap[tiddlerTitle] = true;
      nextTiddler = tiddlerTitle;
      if (nodeMap[tiddlerTitle]) break;
      nodes.push({
        name: tiddlerTitle,
        category: 1,
      });
      nodeMap[tiddlerTitle] = true;
    }

    // 链接
    $tw.utils.each($tw.wiki.getTiddlerLinks(focussedTiddler), function (tiddlerTitle) {
      edges.push({
        source: focussedTiddler,
        target: tiddlerTitle,
        label: {
          show: true,
          formatter: 'link',
        },
      });
      if (nodeMap[tiddlerTitle]) return;
      nodes.push({
        name: tiddlerTitle,
        category: 2,
      });
      nodeMap[tiddlerTitle] = true;
    });

    // 反链
    function pushBackLink(tiddlerTitle, target, stopRecursive) {
      edges.push({
        source: tiddlerTitle,
        target,
        label: {
          show: true,
          formatter: 'backlink',
        },
      });
      if (nodeMap[tiddlerTitle]) return;
      nodes.push({
        name: tiddlerTitle,
        category: 3,
      });
      nodeMap[tiddlerTitle] = true;
      if (stopRecursive === true) return;
      $tw.utils.each($tw.wiki.getTiddlerLinks(tiddlerTitle), (tiddlerTitle2) => {
        pushBackLink(tiddlerTitle2, tiddlerTitle, true);
      });
    }
    $tw.utils.each($tw.wiki.getTiddlerBacklinks(focussedTiddler), (sourceTiddler) =>
      pushBackLink(sourceTiddler, focussedTiddler)
    );

    // 指向哪些 tag
    function pushTag(tiddlerTitle, source, stopRecursive) {
      if (!$tw.wiki.tiddlerExists(tiddlerTitle)) return;
      edges.push({
        source,
        target: tiddlerTitle,
        label: {
          show: true,
          formatter: 'tag',
        },
      });
      if (nodeMap[tiddlerTitle]) return;
      nodes.push({
        name: tiddlerTitle,
        category: 4,
      });
      nodeMap[tiddlerTitle] = true;
      if (stopRecursive === true) return;
      $tw.utils.each($tw.wiki.getTiddler(tiddlerTitle).fields.tags, (tiddlerTag2) => {
        pushBackLink(tiddlerTag2, tiddlerTitle, true);
      });
    }
    $tw.utils.each($tw.wiki.getTiddler(focussedTiddler).fields.tags, (tiddlerTag) =>
      pushTag(tiddlerTag, focussedTiddler)
    );

    // 被谁作为 Tag
    function pushBackTag(tiddlerTitle, target, stopRecursive) {
      edges.push({
        source: tiddlerTitle,
        target,
        label: {
          show: true,
          formatter: 'tag',
        },
      });
      if (nodeMap[tiddlerTitle]) return;
      nodes.push({
        name: tiddlerTitle,
        category: 5,
      });
      nodeMap[tiddlerTitle] = true;
      if (stopRecursive === true) return;
      $tw.utils.each($tw.wiki.getTiddlersWithTag(tiddlerTitle), (tiddlerTitle2) => {
        pushBackTag(tiddlerTitle2, tiddlerTitle, true);
      });
    }
    $tw.utils.each($tw.wiki.getTiddlersWithTag(focussedTiddler), (tiddlerTitle) => {
      pushBackTag(tiddlerTitle, focussedTiddler);
    });

    // 父条目
    var path = focussedTiddler.split('/');
    if (path.length > 1) {
      var parentTiddler = path.slice(0, -1).join('/');
      $tw.utils.each([parentTiddler, parentTiddler + '/'], function (tiddlerTitle) {
        edges.push({
          source: tiddlerTitle,
          target: focussedTiddler,
          label: {
            show: true,
            formatter: 'parent',
          },
        });
        if (nodeMap[tiddlerTitle]) return;
        nodes.push({
          name: tiddlerTitle,
          category: 6,
        });
        nodeMap[tiddlerTitle] = true;
      });
    }
  }
  var index_ = state.historyTiddlers.indexOf(focussedTiddler);
  if (index_ > -1) state.historyTiddlers.splice(index_, 1);
  state.historyTiddlers.push(focussedTiddler);
  state.historyTiddlers.slice(-10);
  echart.setOption({
    legend: [
      {
        data: Categories.map(function (a) {
          return a.name;
        }),
      },
    ],
    title: {
      text: 'The Brain View',
      show: true,
      top: 'bottom',
      left: 'right',
    },
    series: [
      {
        name: 'The Brain View',
        type: 'graph',
        layout: 'force',
        nodes: nodes,
        edges: edges,
        categories: Categories,
        roam: true,
        draggable: true,
        zoom: 4.0,
        label: {
          position: 'right',
          show: true,
        },
        force: {
          repulsion: 50,
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 5,
        },
        lineStyle: {
          opacity: 0.9,
          width: 2,
          curveness: 0,
        },
      },
    ],
  });
};
