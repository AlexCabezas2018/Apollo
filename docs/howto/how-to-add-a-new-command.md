## How do I add a new command? 💻🛠️
We are glad that you are here. That means that you want to enhance the power of Apollo©. In order to do that, just do the following:

1. Declare your new command [here](../../priv/commands.json). If you need to know how to declare commands, you can follow [this guide](https://discord.com/developers/docs/interactions/application-commands). Just remember that the
new command **can't have the same names as the ones already declared**.
2. Add your new command [here](/src/commands). The only thing that you have to consider is to extend the new commands class from its parent [`Command`](/src/commands/Command.ts)
3. Declare the command [here](/src/commands/AvailableCommands.ts) so the bot will have this command available to parse.
4. Implement your logic. You don't need to take care about channel or guild checks, since the parent class will do it for you, just focus in your purpose.
5. Once you are done, run `npm run register` to register the new command.

Well done, you did it! You have a new command for your bot 🥳°🥂⋆🍾࿔*:･

Do you want to improve this process? [Contribute](/README.md#contribution-)! 🚀