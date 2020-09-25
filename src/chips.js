/* eslint-disable no-underscore-dangle */
import M from "materialize-css";

class MChips extends M.Chips {
  _handleInputKeydown(e) {
    MChips._keydown = true;

    // enter (Only changed part to include space(32) and ,(188))
    if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 188) {
      // Override enter if autocompleting.
      if (
        this.hasAutocomplete &&
        this.autocomplete &&
        this.autocomplete.isOpen
      ) {
        return;
      }

      e.preventDefault();
      this.addChip({
        tag: this.$input[0].value,
      });
      this.$input[0].value = "";

      // delete or left
    } else if (
      (e.keyCode === 8 || e.keyCode === 37) &&
      this.$input[0].value === "" &&
      this.chipsData.length
    ) {
      e.preventDefault();
      this.selectChip(this.chipsData.length - 1);
    }
  }
}

export { MChips as default };
