/*\
type: application/javascript
module-type: widget

Import Google Calendar event of today into TiddlyWiki
Usage: <$import-google-calendar-event tags="private GoogleCalendar" />
Attributes: yesterday="yes"

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: true */
  'use strict';

  const Widget = require('$:/core/modules/widgets/widget.js').widget;

  class GoogleCalendarToTiddlyWikiWidget extends Widget {
    /**
     * Lifecycle method: call this.initialise and super
     */
    constructor(parseTreeNode, options) {
      super(parseTreeNode, options);
      this.initialise(parseTreeNode, options);
      this.state = {
        isSignedIn: false,
      };
    }

    /**
     * Lifecycle method: Render this widget into the DOM
     */
    render(parent, nextSibling) {
      this.parentDomNode = parent;
      this.computeAttributes();
      const importButton = this.document.createElement('button');
      importButton.appendChild(
        this.document.createTextNode(this.state.isSignedIn ? this.getAttribute('label') || 'Import Calendar' : 'Login to Google')
      );
      importButton.onclick = this.onImportButtonClick.bind(this);
      parent.insertBefore(importButton, nextSibling);
      this.domNodes.push(importButton);
      this.initClient();
    }

    /**
     * Event listener of button
     */
    async onImportButtonClick() {
      if (!this.state.isSignedIn) {
        try {
          // await this.initClient(); // we have init it in the constructor
          gapi.auth2.getAuthInstance().signIn();
        } catch (error) {
          console.error('GoogleCalendarToTiddlyWikiWidget: Error login using gapi client', error);
        }
      } else {
        try {
          await this.importToWiki();
        } catch (error) {
          console.error('GoogleCalendarToTiddlyWikiWidget: Error importToWiki', error);
        }
      }
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    async initClient() {
      console.log('init');
      // on start up, it might not be loaded, we schedule it later
      if (!window.gapi) {
        setTimeout(this.initClient.bind(this), 100);
        return;
      }

      // Client ID and API key from the Google Developer Console
      // we get it from tiddler
      const CLIENT_ID = $tw.wiki.getTiddler('GoogleCalendarCLIENT_ID').fields.text;
      const API_KEY = $tw.wiki.getTiddler('GoogleCalendarAPI_KEY').fields.text;

      // Array of API discovery doc URLs for APIs used by the script
      const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
      await new Promise((resolve) => gapi.load('client:auth2', resolve));
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus.bind(this));
      // Handle the initial sign-in state.
      this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    updateSignInStatus(isSignedIn) {
      const prevState = { ...this.state };
      if (isSignedIn) {
        this.state.isSignedIn = true;
      } else {
        this.state.isSignedIn = false;
      }
      // this is like React forceUpdate, we use it because it is not fully reactive on this.state change
      if (prevState.isSignedIn !== isSignedIn) {
        this.refreshSelf(); // method from super class
      }
    }

    /**
     * Using $tw to add fetched calender data to TiddlerWiki, and add tags to them
     */
    async importToWiki() {
      const tags = this.getAttribute('tags', '');
      const updateCategoriesOnly = this.getAttribute('categories', 'no') === 'yes';
      const buildCategoryTitle = categoryName => `谷歌日历/类型/${categoryName}`;
      const buildEventTitle = (categoryName, created) => `谷歌日历/事件/${categoryName}-${created}`;
			const categoryTags = `${tags} 谷歌日历/类型`;

      const calendarList = await this.getCalendarLists();
      const categories = calendarList.map(({ summary, description = '', backgroundColor, etag }) => ({
        title: buildCategoryTitle(summary),
        caption: summary,
        text: description,
        tags: categoryTags,
        color: backgroundColor,
        created: new Date(Number(JSON.parse(etag)) / 1000).toTWUTCString(),
      }));
      // update Categories only
      if (updateCategoriesOnly) {
        $tw.wiki.addTiddlers(categories);
        return;
      }
      // update events only
      
      const calendarEvents = await this.getCalendarEvents(calendarList);
      const tiddlers = calendarEvents.map(
        ({
          id,
          start: { dateTime: startDate },
          end: { dateTime: endDate },
          summary,
          description = '',
          created,
          updated = created,
          creator,
          htmlLink,
          organizer: { displayName: category },
          color,
        }) => ({
          title: buildEventTitle(summary, created),
          caption: summary,
          text: description,
          tags: `${tags} ${buildCategoryTitle(category)}`,
          type: 'text/vnd.tiddlywiki',
          startDate,
          endDate,
          created: new Date(created).toTWUTCString(),
          creator: creator.email || 'GoogleCalendar',
          modified: new Date(updated).toTWUTCString(),
          source: htmlLink,
          color, // mixed from calendar data
        })
      );
      $tw.wiki.addTiddlers(tiddlers);
    }

    /**
     * Get calendars we want to import
     */
    async getCalendarLists() {
      const calendarListResponse = await gapi.client.calendar.calendarList.list({ showDeleted: false });
      const calendarList = calendarListResponse.result.items;
      // I set every calendar need to be imported have a description starts with '任务类型'
      return calendarList.filter((calendar) => String(calendar.description).startsWith('任务类型'));
    }

    /**
     * Get list of Calendar events, modify this if you want to customize it for your need
     */
    async getCalendarEvents(calendarList) {
      // set date range
      let timeMin = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
      let timeMax = new Date(new Date().setHours(24, 0, 0, 0)).toISOString();
      const getYesterday = this.getAttribute('yesterday', 'no') === 'yes';
      if (getYesterday) {
        timeMin = new Date(new Date().setHours(-24, 0, 0, 0)).toISOString();
        timeMax = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
      }

      const allEventList = await Promise.all(
        calendarList.map((calendar) => {
          const calendarColor = calendar.backgroundColor;
          // get all events in the calendar
          return gapi.client.calendar.events
            .list({
              calendarId: calendar.id,
              // from midnight to next midnight
              timeMin,
              timeMax,
            })
            .then((eventResponse) => {
              return eventResponse.result.items.map((item) => ({ ...item, color: calendarColor }));
            });
        })
      );
      return allEventList.flat();
    }
  }

  exports['import-google-calendar-event'] = GoogleCalendarToTiddlyWikiWidget;

  // Utils
  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }
  Date.prototype.toTWUTCString = function toTWUTCString() {
    return (
      this.getUTCFullYear() +
      pad(this.getUTCMonth() + 1) +
      pad(this.getUTCDate()) +
      pad(this.getUTCHours()) +
      pad(this.getUTCMinutes()) +
      pad(this.getUTCSeconds()) +
      (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)
    );
  };
})();
