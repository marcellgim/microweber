<div>
    <x-microweber-ui::input name="{{ $this->optionKey }}" wire:model.debounce.300ms="state.settings.{{ $this->optionKey }}" />
</div>
