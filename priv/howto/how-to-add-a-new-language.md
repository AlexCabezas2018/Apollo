## How can I add a new language? 🗣🌎🔠
Hello! If you are here that means that you are interested in customizing your bot. Amazing!
Currently, the bot manages languages using its own system. Users can set the language as a preference, so the system remembers
it at the moment is set!

If you want to add a new language, here are the steps! (**Note**: The default language of the bot is english):
1. Add your custom json file in the [messages folder](../messages). In order to keep consistence, choose a proper name for the file.
As you can see, `en.json` is for english and `es.json` is for spanish. As a recommendation, you can copy one of the files
and rename it.
2. Fill each one of the messages with your own translation. All of them need to be defined, **you can't remove any of the entries**
Take into account that this is what the bot uses to display information in the chat.
3. Once you are done, you need to go [here](/src/preferences/GuildPreferences.ts) and add the new entry in the `SupportedLanguages` enum.
**The value of the new entry must be the same as the name of the file you created in step 1** (so, `SupportedLanguages.ENGLISH = "en"` because the
file name is `en.json`),
4. Change the [lang command](../commands.json) and add the new option. This is important so the bot will have available this choice for the user.
5. run `npm run register` to update the command.

Once you are done, your bot will understand a new language! Isn't that amazing? 😎